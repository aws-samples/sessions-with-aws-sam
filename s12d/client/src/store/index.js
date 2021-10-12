import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth.js';
import links from './links.js';

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    links
  }
})