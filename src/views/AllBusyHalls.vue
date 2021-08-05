<template>
  <div id="allBusyHalls" class="pa-10">
    <v-app-bar color="transparent" elevation="0" app>
      <v-toolbar-title>جدول الاشغال</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn @click="exportExcel()" plain color="success">
        <v-icon>mdi-microsoft-excel</v-icon>
        &nbsp;&nbsp; EXCEL
      </v-btn>
    </v-app-bar>

    <v-row>
      <v-col>
        <table readingOrder="rtl" id="table" cellspacing="0" cellpadding="0" width="100%">
          <thead>
            <tr>
              <td :colspan="halls.length + 2">القاعات</td>
            </tr>
            <tr>
              <td>اليوم</td>
              <td>الوقت</td>
              <td v-for="hall in halls" :key="hall.idHall">
                {{ hall.hallName }}
              </td>
            </tr>
          </thead>
          <template v-if="lessons.length > 0">
            <tbody v-for="day in searchData.days" :key="day">
              <tr
                v-for="(dayTime, index) in [
                  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
                ]"
                :key="dayTime"
              >
                <td>{{ day }}</td>
                <td>{{ Number(startTime[0]) + index + ":" + startTime[1] }}</td>
                <td
                  v-for="hall in halls"
                  :key="hall.idHall"
                  v-html="
                    getLesson(
                      day,
                      hall.idHall,
                      Number(startTime[0]) + index + ':' + startTime[1]
                    )
                  "
                ></td>
              </tr>
            </tbody>
          </template>
        </table>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import "table2excel";
import TableToExcel from "@linways/table-to-excel";

export default {
  name: "AllBusyHalls",
  data: () => ({
    searchData: null,
    timetable: [],
    halls: [],
    startTime: [],
    lessons: [],
  }),
  methods: {
    getLesson(day, hall, time) {
      let lesson = this.timetable.filter(
        (x) => x.day == day && x.hallId == hall && x.time == time
      );
      if (lesson.length > 0) {
        let lessonName = this.lessons.filter(
          (x) => x.id == lesson[0].lessonId
        )[0];
        console.log(lessonName);
        if (lessonName != undefined) {
          return (
            lessonName.name +
            "<br><hr> " +
            lessonName.sectionName +
            "<br><hr> المرحلة " +
            this.getLevelName(lessonName.level) +
            "<br><hr> الشعبة : " +
            lesson[0].classRoom
          );
        }
      } else {
        return "";
      }
    },
    getLevelName(level) {
      switch (level) {
        case 1:
          return "الاولى";
        case 2:
          return "الثانية";
        case 3:
          return "الثالثة";
        case 4:
          return "الرابعة";
        case 5:
          return "الخامسة";
      }
    },
    getHallName(id) {
      if (this.halls.filter((hall) => hall.idHall == id).length > 0) {
        return this.halls.filter((hall) => hall.idHall == id)[0].hallName;
      } else {
        return null
      }
    },
    exportExcel() {
      // const Table2Excel = window.Table2Excel;
      // const table2excel = new Table2Excel();
      // table2excel.export(document.querySelectorAll("table"));
      TableToExcel.convert(document.getElementById("table"), {
        name: "timetable.xlsx",
        sheet: {
          name: "جدول الاشغال",
          
        },
      });
    },
  },
  mounted: function () {
    this.$http
      .get(
        this.$baseUrl +
          `lessons?year=${this.userInfo.currentYear}`
      )
      .then((res) => {
        this.lessons = res.data;
        console.log(this.lessons);
      })
      .finally(() => {});
  },
  created: function () {
    this.$loading.show({ delay: 0 });
    this.searchData = this.$store.getters.getSelectedLevel;
    console.log(this.searchData);
    this.$http
      .get(this.$timeTableBaseUrl + "timetable/halls")
      .then((res) => {
        this.halls = res.data;
        this.$http
          .get(
            this.$timeTableBaseUrl +
              "timetable/allSchedules/" +
              this.userInfo.currentYear +
              "/" +
              this.searchData.course
          )
          .then((res) => {
            let allSchedules = [];
            res.data.forEach((level) => {
              level.schedule.forEach((scheduleInfo) => {
                scheduleInfo.level = level.levelData.level.value;
                scheduleInfo.hallName = this.getHallName(scheduleInfo.hallId) 
              });
              allSchedules.push(...level.schedule);
            });
            this.timetable = allSchedules;
            this.startTime = this.searchData.startTime.split(":");
          })
          .finally(() => {
            this.$loading.hide();
          });
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
#allBusyHalls td,
#allBusyHalls th {
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

#allBusyHalls tbody {
  border-bottom: 2px red solid;
}

#allBusyHalls table {
  border-collapse: collapse;
}
</style>