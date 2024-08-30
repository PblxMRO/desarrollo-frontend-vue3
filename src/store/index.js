import { createStore } from 'vuex'

export default createStore({
  state: {
    count: 0,
    baseUrl: process.env.VUE_APP_API_URL
  },
  getters: {
    getBaseUrl(state) {
      return state.baseUrl
    }
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
