<template>
  <div class="about">
    <v-app-bar color="transparent" elevation="0"  app>
      <v-toolbar-title>القاعات</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="green" @click="addNewDialog = true">
        <v-icon>mdi-plus</v-icon>
        &nbsp; اضافة قاعة جديدة
      </v-btn>
    </v-app-bar>

    <br /><br /><br />
    <v-container>
      <v-row>
        <v-col cols="3" v-for="hall in halls" :key="hall.idHall">
          <v-card class="pa-5">
            <v-card-title>{{ hall.hallName }}</v-card-title>
            <v-card-text>
              <h3 v-if="hall.hallType == 'theoretical'">نظري</h3>
              <h3 v-if="hall.hallType == 'practical'">عملي</h3>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn @click="deleteHall(hall.idHall)" color="red" icon v-bind="attrs" v-on="on">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
                <span>حذف</span>
              </v-tooltip>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="addNewDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">اضافة قاعة جديدة</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  label="اسم القاعة"
                  outlined
                  v-model="form.hallName"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-select
                  v-model="form.hallType"
                  :items="hallTypes"
                  label="نوع القاعة"
                  item-text="name"
                  item-value="value"
                  outlined
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="addNewDialog = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="addNewHall()"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>



<script>
export default {
  name: "Halls",
  data: () => ({
    halls: [],
    addNewDialog: false,
    hallTypes: [
      { value: "theoretical", name: "نظري" },
      { value: "practical", name: "عملي" },
    ],
    form: {
      hallName: "",
      hallType: "",
      sectionId: 0,
      createdBy: 0,
      hallYear: "",
    },
  }),
  created: function () {
    this.fetchData();
  },
  methods: {
    addNewHall() {
      this.$loading.show({ delay: 0 });
      this.$http
        .post(this.$timeTableBaseUrl + "timetable/halls", this.form)
        .then((res) => {
          console.log(res);
          this.fetchData();
        })
        .finally(() => {
          this.$loading.hide();
        });
    },
    fetchData() {
      this.$loading.show({ delay: 0 });
      this.$http
        .get(this.$timeTableBaseUrl + "timetable/halls/" + this.userInfo.perv)
        .then((res) => {
          this.halls = res.data;
        })
        .finally(() => {
          this.$loading.hide();
        });
    },
    deleteHall(id) {
      let confirmPopUp = confirm("هل انت متأكد من حذف القاعة");
      if (!confirmPopUp) {
        return false;
      }
      this.$loading.show({ delay: 0 });
      this.$http.delete(this.$timeTableBaseUrl + "timetable/halls/" + id).then((res) => {

      }).finally(() => {
          this.$loading.hide();
          this.fetchData();
      })
    }
  },
  mounted: function () {
    this.form.sectionId = this.userInfo.perv;
    this.form.createdBy = this.userInfo.id;
    this.form.hallYear = this.userInfo.currentYear;
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    userInfo() {
      return this.$store.getters.getLoginInfo;
    },
  },
};
</script>