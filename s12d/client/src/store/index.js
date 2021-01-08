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
  // state: {
  //   pageSize: 15,
  //   authorized: false,
  //   links: [],
  //   linksBack: [],
  //   filtering: false,
  //   lastIndexFetched: null
  // },
  // mutations: {
  //   authorize(state) {
  //     state.authorized = true;
  //   },
  //   deAuthorize(state) {
  //     state.authorized = false;
  //   },
  //   hydrateLinks(state, data) {
  //     state.links = [...state.links, ...data.Items]
  //     if (data.LastEvaluatedKey && (data.Items.length == state.pageSize)) state.lastIndexFetched = data.LastEvaluatedKey
  //     else state.lastIndexFetched = null
  //   },
  //   drainLinks(state) {
  //     state.links.length = 0;
  //   },
  //   addLink(state, link) {
  //     state.links.push(link);
  //   },
  //   removeLink(state, ind) {
  //     state.links.splice(ind, 1);
  //   },
  //   updateLink(state, link, ind) {
  //     state.links[ind] = link;
  //   },
  //   setPageSize(state, size){
  //     state.pageSize = size
  //   },
  //   filter(state, filterText){
  //     if(!state.filtering) {
  //       state.linksBack = [...state.links]
  //       state.filtering = true;
  //     }
  //     let filtered = state.linksBack.filter(link => link.id.includes(filterText))
  //     state.links = [...filtered]
  //   },
  //   clearFilter(state){
  //     state.links = [...state.linksBack]
  //     state.linksBack = [];
  //     state.filtering = false;
  //   }
  // },
  // getters: {},
  // actions: {},
  // modules: {}
})