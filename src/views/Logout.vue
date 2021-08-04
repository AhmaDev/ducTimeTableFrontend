<template>
  <div id="logout" class="pa-40">
    <br /><br />
    <br /><br />
    <center>
      <v-card class="pa-10" width="400px">
        <v-icon size="70px" color="red"> mdi-power-settings </v-icon>
        <br />
        <br />
        <h2>هل انت متأكد من تسجيل الخروج</h2>
        <br />
        <br />
        <v-btn @click="logout()" block color="red"> نعم </v-btn>
        <br />

        <v-btn to="/home" block> لا </v-btn>
      </v-card>
    </center>
  </div>
</template>

<script>
export default {
  name: "Logout",
  methods: {
      logout() {
          localStorage.clear();
          location.href = '/'
      }
  }
};
</script>

<style>
</style>