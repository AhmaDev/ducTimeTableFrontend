<template>
  <div>
    <div class="login">
      <v-card
        width="600px"
        height="100%"
        elevation="20"
        color="indigo darken-3"
        style="
          padding: 20px;
          background-color: #ffffff33 !important;
          backdrop-filter: blur(50px);
          border-radius: 0px 0px 0px 0px !important;
        "
        class="loginCard"
      >
        <center>
          <div style="width: 50%">
            <br /><br /><br /><br /><br />
            <img src="@/assets/logowhite.png" width="80px" alt="" />
            <br />
            <h2>جامعة دجلة</h2>
            <br><br>
            <v-text-field
              outlined
              v-model="loginInfo.email"
              label="البريد الالكتروني"
              @keyup.enter="performLogin()"
            ></v-text-field>
            <v-text-field
              outlined
              v-model="loginInfo.password"
              type="password"
              label="كلمة المرور"
              @keyup.enter="performLogin()"
            ></v-text-field>
            <v-btn
              :loading="loginInfo.isLoading"
              @click="performLogin()"
              block
              color="primary"
              >دخول</v-btn
            >
            <br />
            <br />
            <center>
              <small> {{this.$appVersion}} </small>
            </center>
          </div>
        </center>
      </v-card>
    </div>
    <v-snackbar color="red" v-model="loginInfo.hasError">
      المعلومات غير صحيحة
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: "Login",
  data: () => ({
    loginInfo: {
      email: "",
      password: "",
      isLoading: false,
      hasError: false,
    },
  }),
  created: function () {},
  methods: {
    performLogin() {
      this.loginInfo.isLoading = true;
      this.$http
        .post(this.$baseUrl + "login", {
          name: this.loginInfo.email,
          password: this.loginInfo.password,
        })
        .then((res) => {
          localStorage.setItem("userinfo", JSON.stringify(res.data));
          this.$store.commit("setLoginInfo", res.data);
        })
        .catch((err) => {
          console.log(err);
          this.loginInfo.hasError = true;
        })
        .finally(() => {
          this.loginInfo.isLoading = false;
        });
    },
  },
};
</script>

<style>
.login {
  background: url("../assets/bg.jpg");
  background-size: cover;
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}

.loginCard {
  text-align: center;
}
</style>