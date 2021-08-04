import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export default new Vuex.Store({
  plugins:[createPersistedState()],
  state: {
    isLoggedIn: false,
    loginInfo: null,
    selectedLevel: null,
  },
  mutations: {
    setLoginInfo: function(state, payload) {
      state.loginInfo = payload;
      state.isLoggedIn = true;
    },
    setSelectedLevel: function(state, payload) {
      state.selectedLevel = payload;
    }
  },
  actions: {
  },
  modules: {
  },
  getters: {
    isLoggedIn : state => state.isLoggedIn,
    getLoginInfo : state => state.loginInfo,
    getSelectedLevel : state => state.selectedLevel
  }
})
