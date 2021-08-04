<template>
  <v-app>
    <v-navigation-drawer
      app
      right
      permanent
      mini-variant
      color="transparent"
      dark
      mini-variant-width="100"
      floating
      v-if="isLoggedIn"
    >
      <br />
      <v-list-item class="px-2">
        <v-list-item-avatar>
          <v-img src="@/assets/favicon.png"></v-img>
        </v-list-item-avatar>
        <v-list-item-title>جامعة دجلة</v-list-item-title>

        <v-btn icon @click.stop="mini = !mini">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>
      <br />
      <v-divider></v-divider>

      <v-list>
        <v-list-item v-for="item in items" :key="item.title" :to="item.route">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <v-list-item @click="colorPickerDialog = !colorPickerDialog">
          <v-list-item-icon>
            <v-icon>mdi-palette-outline</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title></v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="appInfoDialog = !appInfoDialog">
          <v-list-item-icon>
            <v-icon>mdi-information-outline</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-navigation-drawer>

    <div class="mainContent">
      <v-main>
        <v-container class="pa-0 mainContent" fluid>
          <Login v-if="!isLoggedIn" />
          <router-view v-else />
        </v-container>
      </v-main>
    </div>

    <v-dialog v-model="appInfoDialog" width="500">
      <v-card dir="ltr">
        <br>
          <center>
            <img src="@/assets/favicon.png" width="70px">
          </center>
        <v-card-title>
          University section management application
        </v-card-title>

        <v-card-text>
          Designed and  developed by : Ahmad Faris Sabah
          <br>
          <br>
          v {{this.$appVersion}} 
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="appInfoDialog = false"> OK </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <v-dialog v-model="colorPickerDialog" width="500">
      <v-card>
        <v-card-title>
          تغيير لون واجهة المستخدم
        </v-card-title>

        <v-card-text>
          <div @click="changeTheme($event)" class="colorPickerColor pickerPrimary"></div>
          <div @click="changeTheme($event)" class="colorPickerColor pickerPink"></div>
          <div @click="changeTheme($event)" class="colorPickerColor pickerGreen"></div>
          <div @click="changeTheme($event)" class="colorPickerColor pickerYellow"></div>
          <div @click="changeTheme($event)" class="colorPickerColor pickerRed"></div>
          <div @click="changeTheme($event)" class="colorPickerColor pickerLight"></div>
          <div @click="changeTheme($event)" class="colorPickerColor pickerDark"></div>
          <div @click="changeTheme($event)" class="colorPickerColor pickerSexy"></div>
          <div @click="changeTheme($event)" class="colorPickerColor pickerSexy2"></div>
          <div @click="changeTheme($event)" class="colorPickerColor pickerSexy3"></div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="colorPickerDialog = false"> OK </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


  </v-app>
</template>


  
<style src="./global.css"></style>
<style scoped>
.colorPickerColor {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  transition: 0.3s;
  border: 2px rgb(71, 71, 71) solid;
  display: inline-block;
  margin:5px
}
.colorPickerColor:hover {
  transform: scale(1.09);
}
.colorPickerColor:active {
  transform: scale(0.9);
}
.pickerPrimary {
  background: linear-gradient(49deg, rgb(25, 4, 89) 0%, rgb(65, 114, 198) 100%);
}
.pickerPink {
  background: linear-gradient(49deg, rgb(89, 4, 89) 0%, rgb(123, 65, 198) 100%);
}
.pickerGreen {
  background: linear-gradient(49deg, rgb(4, 89, 18) 0%, rgb(198, 178, 65) 100%);
}
.pickerRed {
  background: linear-gradient(49deg, rgb(89, 4, 15) 0%, rgb(189, 69, 32) 100%);
}
.pickerYellow {
  background: linear-gradient(49deg, rgb(89, 69, 4) 0%, rgb(198, 118, 65) 100%);
}
.pickerLight {
  background: linear-gradient(49deg, rgb(189, 189, 189) 0%, rgb(160, 160, 160) 100%);
}
.pickerDark {
  background: linear-gradient(49deg, rgb(0, 0, 0) 0%, rgb(54, 54, 54) 100%);
}
.pickerSexy {
  background: linear-gradient(49deg, rgb(0 ,255 ,246) 0%, rgb(126 ,87 ,161) 100%);
}
.pickerSexy2 {
  background: linear-gradient(49deg, rgb(255,238,0) 0%, rgb(126, 87, 161) 100%);
}
.pickerSexy3 {
  background: linear-gradient(49deg, rgb(0 ,255 ,246) 0%, rgb(196, 96, 14) 100%);
}
</style>
<script>
import Login from "./components/Login.vue";

export default {
  name: "App",
  components: {
    Login,
  },
  data: () => ({
    drawer: true,
    items: [
      {
        title: "الجداول الدراسية",
        icon: "mdi-home-outline",
        route: "/schedules",
      },
      {
        title: "القاعات الدراسية",
        icon: "mdi-google-classroom",
        route: "/halls",
      },
      { title: "تسجيل خروج", icon: "mdi-power-settings", route: "/logout" },
    ],
    mini: true,
    appInfoDialog: false,
    colorPickerDialog: false,
  }),
  created: function () {
    console.log(userInfo);
    let userInfo = localStorage.getItem("userinfo");
    if (userInfo != null && userInfo != undefined) {
      this.$store.commit("setLoginInfo", JSON.parse(userInfo));
    }

    // CHECK COLOR
    let color = localStorage.getItem('bgColor');
    if (color != null && color != undefined) {
      document.getElementsByTagName('body')[0].style.background = color;
    }
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    userInfo() {
      return this.$store.getters.getLoginInfo;
    },
  },
  methods: {
    appInfo() {
      alert("س");
    },
    changeTheme(e) {
      let className = e.path[0].classList[1];
      let color = getComputedStyle(document.getElementsByClassName(className)[0]).background;
      document.getElementsByTagName('body')[0].style.background = color;
      localStorage.setItem('bgColor',color);
    }
  },
};
</script>
