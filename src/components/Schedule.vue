<template>
  <div id="schedule" class="pa-10">
    <v-app-bar color="transparent" elevation="0" app>
      <v-toolbar-title>توزيع الجدول الدراسي</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="saveSchedule()" plain color="warning">
        <v-icon>mdi-check</v-icon>
        &nbsp;&nbsp; حفظ
      </v-btn>

      <v-btn @click="hideInputs = !hideInputs" plain color="blue">
        <v-icon>mdi-eye-outline</v-icon>
        &nbsp;&nbsp; اخفاء حقول الادخال
      </v-btn>
      <v-btn @click="exportExcel()" plain color="success">
        <v-icon>mdi-microsoft-excel</v-icon>
        &nbsp;&nbsp; EXCEL
      </v-btn>
      <v-btn @click="deleteSchedule()" plain color="red">
        <v-icon>mdi-delete-outline</v-icon>
        &nbsp;&nbsp; حذف الجدول
      </v-btn>
    </v-app-bar>
    <v-row>
      <template v-for="(classRoom, index) in currentLevelClasses">
        <v-col md="6" sm="12" xs="12" :key="classRoom + index">
          <table
            v-if="levelData != null"
            cellspacing="0"
            cellpadding="0"
            width="100%"
            :key="classRoom"
          >
            <thead>
              <tr>
                <th rowspan="2">اليوم</th>
                <th rowspan="2">الوقت</th>
                <th colspan="3">{{ levelData.level.name }} {{ classRoom }}</th>
              </tr>
              <tr>
                <td :key="classRoom + '_lesson'">المادة</td>
                <td :key="classRoom + '_teacher'">التدريسي</td>
                <td :key="classRoom + '_hall'">القاعة</td>
              </tr>
            </thead>
            <template v-for="day in levelData.scheduleData.days">
              <tbody :key="day">
                <tr>
                  <td
                    :rowspan="
                      schedule.filter(
                        (l) => l.day == day && l.classRoom == classRoom
                      ).length + 2
                    "
                  >
                    {{ day }}
                  </td>
                </tr>
                <tr
                  v-for="(currentLesson, lessonIndex) in schedule.filter(
                    (l) => l.day == day && l.classRoom == classRoom
                  )"
                  :key="currentLesson.customId"
                  :class="{'noHall': getHallName(currentLesson.hallId) == null}"
                >
                  <td>
                    {{ Number(startTime[0]) + lessonIndex }}:{{ startTime[1] }}
                  </td>
                  <td style="text-align: right">
                    <v-btn
                      v-if="!hideInputs"
                      small
                      @click="deleteLesson(currentLesson.customId)"
                      color="red"
                      icon
                      rounded
                      ><v-icon>mdi-close</v-icon></v-btn
                    >
                    {{
                      lessons.filter(
                        (lesson) => lesson.id == currentLesson.lessonId
                      )[0].name
                    }}
                  </td>
                  <td
                    :id="'teacher_' + classRoom + '_' + day + '_' + lessonIndex"
                  >
                    {{
                      lessons.filter(
                        (lesson) => lesson.id == currentLesson.lessonId
                      )[0].teacherName
                    }}
                  </td>
                  <td :id="'hall_' + classRoom + '_' + day + '_' + lessonIndex">
                    {{
                      getHallName(currentLesson.hallId)
                    }}
                  </td>
                </tr>
                <tr v-if="!hideInputs">
                  <td
                    style="background-color: #65656533"
                    colspan="2"
                    :key="classRoom + index + '_lesson'"
                  >
                    <select
                      style="width: 100%"
                      class="selectCustom"
                      :id="'lessonSelect' + '_' + classRoom + '_' + day"
                    >
                      <option selected value="0" disabled>اختيار مادة</option>
                      <option
                        v-for="lesson in lessons"
                        :key="lesson.id"
                        :value="lesson.id"
                      >
                        {{ lesson.name }} - {{ lesson.teacherName }} - نظري
                        {{ lesson.thHoure }} - عملي {{ lesson.prHoure }}
                      </option>
                    </select>
                  </td>
                  <td style="background-color: #65656533">
                    <select
                      class="selectCustom"
                      :id="'hallSelect' + '_' + classRoom + '_' + day"
                    >
                      <option selected value="0" disabled>اختيار قاعة</option>
                      <optgroup label="نظري">
                        <option
                          v-for="hall in halls.filter(
                            (x) => x.hallType == 'theoretical'
                          )"
                          :key="hall.idHall"
                          :value="hall.idHall"
                        >
                          {{ hall.hallName }}
                        </option>
                      </optgroup>
                      <optgroup label="عملي">
                        <option
                          v-for="hall in halls.filter(
                            (x) => x.hallType == 'practical'
                          )"
                          :key="hall.idHall"
                          :value="hall.idHall"
                        >
                          {{ hall.hallName }}
                        </option>
                      </optgroup>
                    </select>
                  </td>
                  <td style="background-color: #65656533">
                    <v-btn
                      @click="addNewLesson(day, classRoom)"
                      color="red"
                      small
                    >
                      اضافة
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </table>
        </v-col>
      </template>
    </v-row>
  </div>
</template>

<script>
const ExcelJS = require("exceljs");
import { saveAs } from "file-saver";

export default {
  name: "Schedule",
  data: () => ({
    scheduleId: 0,
    levelData: null,
    lessons: [],
    currentLevelClasses: [],
    schedule: [],
    startTime: [],
    halls: [],
    hideInputs: false,
    allSchedules: [],
    sectionId: 0,
  }),
  mounted: function () {
    this.sectionId = this.userInfo.perv;
    this.$loading.show({ delay: 0 });
    this.levelData = this.$store.getters.getSelectedLevel;
    this.$http
      .get(
        this.$timeTableBaseUrl +
          "timetable/schedule/" +
          this.levelData.level.value +
          "/" +
          this.userInfo.currentYear +
          "/" +
          this.levelData.scheduleData.course +
          "/" +
          this.userInfo.perv
      )
      .then((res) => {
        this.levelData = JSON.parse(res.data.levelData);
        this.schedule = JSON.parse(res.data.schedule);
        this.scheduleId = res.data.idSchedule;
        console.log(this.scheduleId);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        this.startTime = this.levelData.scheduleData.startTime.split(":");
        this.currentLevelClasses =
          this.levelData.scheduleData.classes[this.levelData.level.value - 1];
        console.log(this.levelData);
        this.lessons = this.levelData.lessons;
        this.lessons.push({
          id: 10000000 * Math.random(),
          name: "Break",
          teacherName: "استراحه",
        });
        console.log(this.scheduleId);

        this.$http
          .get(
            this.$timeTableBaseUrl +
              `timetable/schedules/${this.sectionId}` +
              "/" +
              this.userInfo.currentYear +
              "/" +
              this.levelData.scheduleData.course
          )
          .then((res) => {
            let allSchedules = [];
            res.data.forEach((level) => {
              level.schedule.forEach((scheduleInfo) => {
                if (
                  this.halls.filter((x) => x.idHall == scheduleInfo.hallId)
                    .length == 0
                ) {
                  scheduleInfo.hallName = this.getHallName(scheduleInfo.hallId);
                } else {
                  scheduleInfo.hallName = "لا يوجد";
                }
                scheduleInfo.level = level.levelData.level.value;
              });
              allSchedules.push(...level.schedule);
            });
            this.allSchedules = allSchedules;
            console.log(this.allSchedules);
          })
          .finally(() => {
            this.$loading.hide();
          });
      });
  },
  methods: {
    addNewLesson(day, classRoom) {
      let lessonId = document.getElementById(
        "lessonSelect_" + classRoom + "_" + day
      ).value;
      let hallId = document.getElementById(
        "hallSelect_" + classRoom + "_" + day
      ).value;
      // let hallName = this.getHallName(hallId);

      console.log(lessonId, hallId);
      console.log(this.lessons.filter(x => x.id == lessonId));
      if (this.lessons.filter(x => x.id == lessonId)[0].name != 'Break') {
      // CHECK FIELDS
      if (lessonId == 0) {
        this.$toast.open({
          message: `يرجى اختيار مادة`,
          type: "error",
          duration: 5000,
        });
        return;
      }
      if (hallId == 0) {
        this.$toast.open({
          message: `يرجى اختيار قاعة`,
          type: "error",
          duration: 5000,
        });
        return;
      }
      // GET NEXT INDEX
      let index = this.schedule.filter(
        (s) => s.day == day && s.classRoom == classRoom
      ).length;
      // CHECK OTHER CLASS ROOMS
      

      for (let i = 0; i < this.currentLevelClasses.length; i++) {
        if (
          document.getElementById(
            `teacher_${this.currentLevelClasses[i]}_${day}_${index}`
          ) != null
        ) {
          if (
            document
              .getElementById(
                `teacher_${this.currentLevelClasses[i]}_${day}_${index}`
              )
              .innerText.replace(/ /g, "") ==
            this.lessons
              .filter((lesson) => lesson.id == lessonId)[0]
              .teacherName.replace(/ /g, "")
          ) {
            this.$toast.open({
              message: `الاستاذ ${
                this.lessons.filter((lesson) => lesson.id == lessonId)[0]
                  .teacherName
              } مشغول في المرحلة ${
                this.currentLevelClasses[i]
              }  يرجى اختيار مادة اخرى`,
              type: "error",
              duration: 5000,
            });
            document.getElementById(
              "lessonSelect_" + classRoom + "_" + day
            ).value = 0;
            document.getElementById(
              "hallSelect_" + classRoom + "_" + day
            ).value = 0;
            return;
          }
        }
        if (
          document.getElementById(
            `hall_${this.currentLevelClasses[i]}_${day}_${index}`
          ) != null
        ) {
          if (
            document.getElementById(
              `hall_${this.currentLevelClasses[i]}_${day}_${index}`
            ).innerText == this.getHallName(hallId)
          ) {
            this.$toast.open({
              message: `القاعة مشغول في الشعبة ${this.currentLevelClasses[i]}  يرجى اختيار قاعة اخرى`,
              type: "error",
              duration: 5000,
            });
            document.getElementById(
              "lessonSelect_" + classRoom + "_" + day
            ).value = 0;
            document.getElementById(
              "hallSelect_" + classRoom + "_" + day
            ).value = 0;
            return;
          }
        }
      }

      let time =
        Number(this.startTime[0]) +
        this.schedule.filter((x) => x.classRoom == classRoom && x.day == day)
          .length +
        ":" +
        this.startTime[1];

      let allMatchedHallsByTime = this.allSchedules.filter(
        (x) => x.hallId == hallId && x.time == time && x.day == day
      );

      if (allMatchedHallsByTime.length > 0) {
        this.$toast.open({
          message: `القاعة مشغول في المرحلة ${allMatchedHallsByTime[0].level} الشعبة ${allMatchedHallsByTime[0].classRoom}  يرجى اختيار قاعة اخرى`,
          type: "error",
          duration: 5000,
        });
        document.getElementById(
          "lessonSelect_" + classRoom + "_" + day
        ).value = 0;
        document.getElementById(
          "hallSelect_" + classRoom + "_" + day
        ).value = 0;
        return;
      }

      let allMatchedTeachersByTime = this.allSchedules.filter(
        (x) => x.teacherName == this.lessons.filter((x) => x.id == lessonId)[0]
          .teacherName && x.time == time && x.day == day
      );


      if (allMatchedTeachersByTime.length > 0) {
        this.$toast.open({
          message: `الاستاذ ${this.lessons.filter((x) => x.id == lessonId)[0]
          .teacherName} مشغول في المرحلة ${allMatchedTeachersByTime[0].level} الشعبة ${allMatchedTeachersByTime[0].classRoom}  يرجى اختيار قاعة اخرى`,
          type: "error",
          duration: 5000,
        });
        document.getElementById(
          "lessonSelect_" + classRoom + "_" + day
        ).value = 0;
        document.getElementById(
          "hallSelect_" + classRoom + "_" + day
        ).value = 0;
        return;
      }
      }

      this.schedule.push({
        lessonId: lessonId,
        hallId: hallId,
        day: day,
        teacherName: this.lessons.filter((x) => x.id == lessonId)[0]
          .teacherName,
        classRoom: classRoom,
        customId: Date.now(),
        time:
          Number(this.startTime[0]) +
          this.schedule.filter((x) => x.classRoom == classRoom && x.day == day)
            .length +
          ":" +
          this.startTime[1],
      });
      console.log(this.schedule);
      document.getElementById(
        "lessonSelect_" + classRoom + "_" + day
      ).value = 0;
      document.getElementById("hallSelect_" + classRoom + "_" + day).value = 0;
    },
    deleteLesson(id) {
      let lessonIndex = this.schedule.findIndex(
        (lesson) => lesson.customId == id
      );
      this.schedule.splice(lessonIndex, 1);
      console.log(this.schedule);
    },
    saveSchedule() {
      this.$loading.show({ delay: 0 });
      if (this.scheduleId != 0) {
        this.$http
          .put(
            this.$timeTableBaseUrl + "timetable/schedule/" + this.scheduleId,
            {
              level: this.levelData.level.value,
              year: this.userInfo.currentYear,
              levelData: JSON.stringify(this.levelData),
              schedule: JSON.stringify(this.schedule),
              createdBy: this.userInfo.id,
              course: this.levelData.scheduleData.course,
              sectionId: this.userInfo.perv,
            }
          )
          .then((res) => {
            this.scheduleId = res.data.insertId;
            this.$toast.open({
              message: `تم حفظ الجدول`,
              type: "success",
              duration: 5000,
            });
          })
          .catch((err) => {
            console.log(err);
            this.$toast.open({
              message: `حدث خطأ ما`,

              type: "error",
              duration: 5000,
            });
          })
          .finally(() => {
            this.$loading.hide();
          });
        return;
      }
      this.$http
        .post(this.$timeTableBaseUrl + "timetable/schedule", {
          level: this.levelData.level.value,
          year: this.userInfo.currentYear,
          levelData: JSON.stringify(this.levelData),
          schedule: JSON.stringify(this.schedule),
          createdBy: this.userInfo.id,
          course: this.levelData.scheduleData.course,
          sectionId: this.userInfo.perv,
        })
        .then((res) => {
          this.scheduleId = res.data.insertId;
          this.$toast.open({
            message: `تم حفظ الجدول`,
            type: "success",
            duration: 5000,
          });
        })
        .catch((err) => {
          console.log(err);
          this.$toast.open({
            message: `حدث خطأ ما`,

            type: "error",
            duration: 5000,
          });
        })
        .finally(() => {
          this.$loading.hide();
        });
    },
    deleteSchedule() {
      let confirmPopUp = confirm("هل انت متأكد من حذف الجدول");
      if (!confirmPopUp) {
        return false;
      }
      this.$loading.show({ delay: 0 });
      this.$http
        .delete(
          this.$timeTableBaseUrl + "timetable/schedule/" + this.scheduleId
        )
        .then((res) => {
          this.schedule = [];
          this.$toast.open({
            message: `تم حذف الجدول`,
            type: "success",
            duration: 5000,
          });
        })
        .finally(() => {
          this.$loading.hide();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async exportExcel() {
      const workbook = new ExcelJS.Workbook();
      this.currentLevelClasses.forEach((classRoom) => {
        const worksheet = workbook.addWorksheet(classRoom, {
          properties: { tabColor: { argb: "FFC0000" } },
        });
        worksheet.views = [
          {
            rightToLeft: true,
            zoomScale: 200,
          },
        ];
        worksheet.columns = [
          { header: "اليوم", key: "day", width: 10 },
          { header: "الوقت", key: "time", width: 10 },
          {
            header:
              this.userInfo.sectionName +
              " - " +
              this.levelData.level.name +
              " " +
              classRoom,
            key: "title",
          },
        ];
        worksheet.getCell("C2").value = "المادة";
        worksheet.getCell("D2").value = "التدريسي";
        worksheet.getCell("E2").value = "القاعة";
        worksheet.getColumn("C").width = 20;
        worksheet.getColumn("D").width = 20;
        worksheet.getColumn("E").width = 20;
        this.levelData.scheduleData.days.forEach((day) => {
          this.schedule
            .filter((l) => l.day == day && l.classRoom == classRoom)
            .forEach((currentLesson, lessonIndex) => {
              worksheet.addRow([
                day,
                Number(this.startTime[0]) +
                  lessonIndex +
                  ":" +
                  Number(this.startTime[1]),
                this.lessons.filter(
                  (lesson) => lesson.id == currentLesson.lessonId
                )[0].name,
                this.lessons.filter(
                  (lesson) => lesson.id == currentLesson.lessonId
                )[0].teacherName,
                this.getHallName(currentLesson.hallId),
              ]);
              console.log(currentLesson);
            });
        });
        worksheet.mergeCells("A1:A2");
        worksheet.mergeCells("B1:B2");
        worksheet.mergeCells("C1:E1");

        let hallsColumn = worksheet.getColumn("A");
        let cellsIndex = [];
        hallsColumn.eachCell((cell) => {
          cellsIndex.push({ cellName: cell.address, cellValue: cell.value });
        });

        this.levelData.scheduleData.days.forEach((day, index) => {
          let mergeCell = cellsIndex.filter((x) => x.cellValue == `${day}`);
          if (mergeCell.length > 0) {
            worksheet.mergeCells(
              `${mergeCell[0].cellName}:${
                mergeCell[mergeCell.length - 1].cellName
              }`
            );
          }
        });
        worksheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
          row.eachCell((cell) => {
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
            cell.alignment = { vertical: "middle", horizontal: "center" };
          });
        });
      });
      let teachersSet = new Set(this.schedule.map((x) => x.teacherName));
      for (let teacher of teachersSet) {
        const worksheet = workbook.addWorksheet(teacher, {
          properties: { tabColor: { argb: "FF00FF00" } },
        });
        worksheet.views = [
          {
            rightToLeft: true,
            zoomScale: 200,
          },
        ];

        worksheet.columns = [
          { header: "اليوم", key: "day", width: 10 },
          { header: "الوقت", key: "time", width: 10 },
          { header: "المادة", key: "lesson", width: 20 },
          { header: "الشعبة", key: "classRoom", width: 10 },
          { header: "القاعة", key: "hall", width: 10 },
        ];

        worksheet.insertRow(1, [teacher + " - " + this.userInfo.sectionName]);
        worksheet.mergeCells("A1:E1");

        this.levelData.scheduleData.days.forEach((day) => {
          this.schedule
            .filter((x) => x.day == day && x.teacherName == teacher)
            .forEach((schedule) => {
              worksheet.addRow([
                day,
                schedule.time,
                this.lessons.filter((x) => x.id == schedule.lessonId)[0].name,
                schedule.classRoom,
                this.getHallName(schedule.hallId)
              ]);
            });
        });

        let hallsColumn = worksheet.getColumn("A");
        let cellsIndex = [];
        hallsColumn.eachCell((cell) => {
          cellsIndex.push({ cellName: cell.address, cellValue: cell.value });
        });

        this.levelData.scheduleData.days.forEach((day, index) => {
          let mergeCell = cellsIndex.filter((x) => x.cellValue == `${day}`);
          if (mergeCell.length > 0) {
            worksheet.mergeCells(
              `${mergeCell[0].cellName}:${
                mergeCell[mergeCell.length - 1].cellName
              }`
            );
          }
        });
        worksheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
          row.eachCell((cell) => {
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
            cell.alignment = { vertical: "middle", horizontal: "center" };
          });
        });
      }
      const buf = await workbook.xlsx.writeBuffer();

      saveAs(
        new Blob([buf]),
        "جدول وتقارير " + this.levelData.level.name + ".xlsx"
      );
    },
    getHallName(id) {
      if (this.halls.filter((hall) => hall.idHall == id).length > 0) {
        return this.halls.filter((hall) => hall.idHall == id)[0].hallName;
      } else {
        return null
      }
    },
  },
  created: function () {
    this.$http
      .get(this.$timeTableBaseUrl + "timetable/halls/" + this.userInfo.perv)
      .then((res) => {
        this.halls = res.data;
        console.log(this.halls);
      })
      .finally(() => {
        this.$loading.hide();
      });
  },
  computed: {
    userInfo() {
      return this.$store.getters.getLoginInfo;
    },
  },
};
</script>

<style>
#schedule td,
#schedule th {
  border: 1px rgb(103, 103, 103) solid;
  border-spacing: 0;
  margin: 0;
  padding: 5px;
  text-align: center;
}

.selectCustom {
  background-color: transparent;
  color: #fff;
  border: none;
  text-align: center;
}

#schedule tbody {
  border-bottom: 2px red solid;
}

#schedule table {
  border-collapse: collapse;
}

.noHall {
  background-color:rgba(0, 0, 0, 0.329);
  color: rgb(255, 255, 255);
  opacity: 0.5;
}
</style>