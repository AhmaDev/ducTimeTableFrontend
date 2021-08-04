<template>
  <div class="pa-10">
    <v-app-bar color="transparent" app elevate-on-scroll>
      <v-toolbar-title>الرئيسية</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-title>عدد القاعات : {{ halls.length }}</v-toolbar-title>
      <v-spacer v-if="schedules.length > 0"></v-spacer>
      <v-btn v-if="schedules.length > 0" color="success" @click="goToBusyHalls()"> جدول الاشغال </v-btn>
    </v-app-bar>

    <v-row>
      <v-col>
        <v-select
          v-model="search.course"
          :items="courses"
          label="الفصل"
          item-text="name"
          item-value="value"
          outlined
          dense
        ></v-select>
      </v-col>
      <v-col>
        <v-text-field
          label="السنة الدراسية"
          :value="userInfo.currentYear"
          disabled
          outlined
          dense
        ></v-text-field>
      </v-col>
      <v-col cols="4">
        <v-select
          v-model="search.days"
          :items="days"
          label="ايام الاسبوع المطلوبة"
          multiple
          chips
          outlined
          dense
        ></v-select>
      </v-col>
      <v-col>
        <v-text-field
          label="وقت بداية الداوم"
          v-model="search.startTime"
          type="time"
          outlined
          dense
        ></v-text-field>
      </v-col>
      <!-- <v-col cols="3">
        <h4>وقت المحاضرة : {{ search.lectureTime }} دقيقة</h4>
        <v-slider
          v-model="search.lectureTime"
          hint="وقت المحاضرة "
          max="120"
          min="1"
        ></v-slider>
      </v-col> -->
      <v-col cols="1">
        <v-btn @click="performSearch()" color="green" elevation="2" fab>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <center>
      <div class="noData" v-if="lessons.length == 0">
        <br /><br /><br />
        <img height="400px" src="@/assets/search.svg" />
        <br />
        <h3>قم باختيار المحددات لعرض المراحل الدراسية</h3>
      </div>
    </center>

    <v-row v-if="schedules.length > 0">
      <v-col :cols="getColsNumber()" v-for="schedule in schedules" :key="schedule.idSchedule">
        <v-card class="pa-10">
          {{ levels.filter((x) => x.value == schedule.level)[0].name }}
          <br />

          <v-slide-group multiple show-arrows>
            <v-chip
              style="margin: 5px 8px"
              v-for="classRoom in schedule.levelData.scheduleData.classes[
                schedule.level - 1
              ]"
              :key="classRoom"
              >{{ classRoom }}</v-chip
            >
          </v-slide-group>
          <br>
          <v-btn @click="goToSchedule(schedule)" style="float: left" color="primary">
            تعديل
          </v-btn>
          <br>
        </v-card>
      </v-col>
    </v-row>

    <div :key="forceRender">
      <v-row v-if="lessons.length > 0">
        <v-col :cols="getColsNumber()" v-for="(level, index) in levels" :key="level.value">
          <template v-if="lessons[index].length > 0">
            <v-simple-table
              fixed-header
              dense
              style="margin-bottom: 30px"
              height="500px"
            >
              <template v-slot:default>
                <thead>
                  <tr>
                    <td colspan="4">
                      <br />
                      <center>
                        <h3>{{ level.name }}</h3>
                      </center>
                      <br />
                    </td>
                  </tr>
                </thead>
                <thead>
                  <tr>
                    <th class="text-left">اسم المادة</th>
                    <th class="text-left">النظري</th>
                    <th class="text-left">العملي</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="lesson in lessons[index]" :key="lesson.name">
                    <td>
                      <b>{{ lesson.name }}</b> <br />
                      <small>{{ lesson.teacherName }}</small>
                    </td>
                    <td>{{ lesson.thHoure }}</td>
                    <td>{{ lesson.prHoure }}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td>المجموع:</td>
                    <td>
                      {{
                        lessons[index].reduce(function (total, value) {
                          return total + Number(value.thHoure);
                        }, 0)
                      }}
                    </td>
                    <td>
                      {{
                        lessons[index].reduce(function (total, value) {
                          return total + Number(value.prHoure);
                        }, 0)
                      }}
                    </td>
                  </tr>
                </tfoot>
              </template>
            </v-simple-table>
            <v-select
              v-model="search.classes[index]"
              :items="classes"
              label="الشعب"
              multiple
              chips
              outlined
              dense
            ></v-select>
            <v-btn
              :disabled="search.classes[index].length == 0"
              block
              @click="openBottomSheet(level, lessons[index])"
              color="#009D00"
            >
              توزيع المواد على القاعات
            </v-btn>
          </template>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "Schedules",
  data: () => ({
    schedules: [],
    lessons: [],
    forceRender: 0,
    courses: [
      { name: "الكورس الاول صباحي", value: 1 },
      { name: "الكورس الثاني صباحي", value: 2 },
      { name: "النظام السنوي صباحي", value: 3 },
      { name: "الكورس الاول مسائي", value: 4 },
      { name: "الكورس الاول مسائي", value: 5 },
      { name: "النظام السنوي مسائي", value: 6 },
    ],
    search: {
      course: 1,
      days: ["السبت", "الاحد", "الاثنين", "الثلاثاء", "الاربعاء"],
      classes: [[], [], [], [], []],
      lectureTime: 60,
      level: 1,
      startTime: "08:30",
    },
    halls: [],
    days: [
      "السبت",
      "الاحد",
      "الاثنين",
      "الثلاثاء",
      "الاربعاء",
      "الخميس",
      "الجمعة",
    ],
    classes: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"],
    levels: [
      { name: "المرحلة الاولى", value: 1 },
      { name: "المرحلة الثانية", value: 2 },
      { name: "المرحلة الثالثة", value: 3 },
      { name: "المرحلة الرابعة", value: 4 },
      { name: "المرحلة الخامسة", value: 5 },
    ],
    schedule: [[], [], [], [], []],
    selectedLevel: null,
  }),
  components: {},
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    userInfo() {
      return this.$store.getters.getLoginInfo;
    },
  },
  methods: {
    performSearch() {
      this.schedules = [];
      if (this.search.course == 3) {
        this.search.course = 1;
      }
      this.$loading.show({ delay: 0 });
      this.$http
        .get(
          this.$baseUrl +
            `lessons?sectionId=${this.userInfo.perv}&course=${this.search.course}&year=${this.userInfo.currentYear}`
        )
        .then((res) => {
          this.lessons[0] = res.data
            .filter((lesson) => lesson.level == 1)
            .reverse();
          this.lessons[1] = res.data
            .filter((lesson) => lesson.level == 2)
            .reverse();
          this.lessons[2] = res.data
            .filter((lesson) => lesson.level == 3)
            .reverse();
          this.lessons[3] = res.data
            .filter((lesson) => lesson.level == 4)
            .reverse();
          this.lessons[4] = res.data
            .filter((lesson) => lesson.level == 5)
            .reverse();
          console.log(this.lessons);

          this.$http
            .get(
              this.$timeTableBaseUrl +
                `timetable/schedules/${this.userInfo.perv}/${this.userInfo.currentYear}/${this.search.course}`
            )
            .then((res) => {
              this.schedules = res.data;
              console.log("Schedules", this.schedules);
            });

          this.forceRender += 1;
        })
        .finally(() => {
          this.$loading.hide();
        });
    },
    openBottomSheet(level, lessons) {
      this.selectedLevel = {
        level: level,
        lessons: lessons,
        scheduleData: this.search,
      };
      this.forceRender++;
      this.$store.commit("setSelectedLevel", this.selectedLevel);
      this.$router.push("/schedule");
      // this.$refs.scheduler.open()
    },
    goToBusyHalls() {
      this.forceRender++;
      this.$store.commit("setSelectedLevel", this.search);
      this.$router.push("/busyHalls");
    },
    goToSchedule(schedule) {
      this.selectedLevel = schedule.levelData;
      this.forceRender++;
      this.$store.commit("setSelectedLevel", this.selectedLevel);
      this.$router.push("/schedule");
    },
    getColsNumber() {
      if (this.lessons[4].length > 0) {
        return 0
      } else {
        return 3
      }
    }
  },
  created: function () {
    this.$http
      .get(this.$timeTableBaseUrl + "timetable/halls/" + this.userInfo.perv)
      .then((res) => {
        this.halls = res.data;
      })
      .finally(() => {
        this.$loading.hide();
      });
  },
};
</script>
