import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import store from './store'
import Dialog from 'vue-dialog-loading'
import VueBottomSheet from "@webzlodimir/vue-bottom-sheet";
import draggable from 'vuedraggable';

let serverIp = 'localhost';

Vue.use(Dialog, {
  dialogBtnColor: '#0f0',
  background: 'rgba(0, 0, 0, 0.5)'
})
Vue.config.productionTip = false
Vue.prototype.$baseUrl = 'http://10.0.0.254:8000/api/';
Vue.prototype.$timeTableBaseUrl = 'http://'+serverIp+':10900/timetable/api/v1/';
Vue.prototype.$appVersion = '1.0.1';
Vue.http = Vue.prototype.$http = axios;

import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

Vue.use(VueToast);
Vue.use(VueBottomSheet);
Vue.use(draggable);

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
