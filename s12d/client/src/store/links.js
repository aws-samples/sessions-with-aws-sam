import axios from 'axios';
import {
  nanoid
} from 'nanoid';
import router from '@/router'
const apiUrl = process.env.VUE_APP_API_ROOT
const reserveWords = ['app','client','s12dAssetsDirectory']

const state = {
  links: [],
  pageSize: 100,
  fetching_data: false,
  fetching_error: false,
  fetchingErrorMessage: null,
  lastKeyFetched: null,
  currentLink: null,
  filterText: null,
  editingLink: false,
  editLink: null,
  fetchingInitialData: true,
  missingLink: false
}

export default {
  state,
  mutations: {
    START_FETCHING(state) {
      state.fetching_data = true;
      state.fetching_error = false;
      state.fetchingErrorMessage = null;
    },
    FETCHING_ERROR(state, errorMessage = null) {
      state.fetching_data = false;
      state.fetching_error = true;
      state.fetchingInitialData = false;
      if (errorMessage) state.fetchingErrorMessage = errorMessage
    },
    FETCHING_SUCCESS(state, data) {
      state.fetching_data = false;
      state.links = [...state.links, ...data.Items];
      state.fetchingInitialData = false;
      state.lastKeyFetched = (data.LastEvaluatedKey && (data.Items.length == state.pageSize)) ? data.LastEvaluatedKey : null;
    },
    REMOVE_LINK(state, linkId) {
      let i = state.links.indexOf(link => link.id = linkId)
      state.links.splice(i, 1)
    },
    SET_CURRENT_LINK(state, data) {
      state.currentLink = data;
    },
    SET_FILTER_TEXT(state, data) {
      state.filterText = data
    },
    SET_EDITING_LINK(state, data) {
      state.editingLink = data;
    },
    SET_EDIT_LINK(state, data) {
      state.editLink = data;
    },
    ADD_LINK(state, data) {
      state.links.push(data);
    },
    CLEAR_ALERT(state){
      state.fetching_error = false
    },
    SET_MISSING_LINK(state, data){
      state.missingLink = data
    }
  },
  actions: {
    FETCH_DATA: async ({
      commit,
      state
    }) => {
      commit('START_FETCHING');
      try {
        let route = `app/?pageSize=${state.pageSize}`;
        if (state.lastKeyFetched) route += `&pageKey=${state.lastKeyFetched}`
        let results = await axios.get(`${apiUrl}/${route}`, {
          headers: {
            Authorization: window.localStorage.getItem("cognitoIdentityToken"),
          },
        })
        if(results.data.error){
          commit('FETCHING_ERROR', results.data.message);
        } else {
          commit('FETCHING_SUCCESS', results.data)
        }
      } catch (err) {
        commit('FETCHING_ERROR');
      }
    },
    UPDATE_LINK: async ({
      commit,
      dispatch,
      state
    }) => {
      commit('START_FETCHING');
      let response = await axios.put(`${apiUrl}/app/${state.editLink.id}`, state.editLink, {
        headers: {
          Authorization: window.localStorage.getItem("cognitoIdentityToken"),
        },
      })
      if (response.data.error) {
        commit('FETCHING_ERROR', response.data.message);
        dispatch("SET_DETAILS", state.editLink.id)
      } else {
        commit('REMOVE_LINK', state.editLink.id)
        commit('FETCHING_SUCCESS', {Items:[state.editLink]})
      }
      commit("SET_EDITING_LINK", false)
    },
    CREATE_LINK: async ({
      commit,
      dispatch,
      state
    }) => {
      if(reserveWords.includes(state.editLink.id.toLowerCase())){
        commit('FETCHING_ERROR', `"${state.editLink.id}" is a reserver word and cannot be used as a link.`);
      } else {
        commit('START_FETCHING');
        let response = await axios.post(`${apiUrl}/app/`, state.editLink, {
          headers: {
            Authorization: window.localStorage.getItem("cognitoIdentityToken"),
          },
        })
        if (response.data.error) {
          commit('FETCHING_ERROR', response.data.message);
          dispatch("SET_DETAILS", state.editLink.id)
        } else {
          commit('FETCHING_SUCCESS', {Items:[response.data]})
          router.push({name: 'dashboard'})
        }
      }
    },
    DELETE_LINK: async ({commit, state}) => {
      commit('START_FETCHING');
      try{
      let response = await axios.delete(`${apiUrl}/app/${state.editLink.id}`, {
        headers: {
          Authorization: window.localStorage.getItem("cognitoIdentityToken"),
        },
      })
      if (response.data.error) {
        commit('FETCHING_ERROR', response.data.message);
      } else {
        commit('REMOVE_LINK', state.editLink.id)
        router.push({name: 'dashboard'})
      }
    } catch(err) {
      commit('FETCHING_ERROR', err);
    }
    },
    SET_DETAILS: ({
      commit,
      state
    }, linkId) => {
      let tempLink = state.links.filter(link => link.id == linkId)
      let tempObj = Object.assign({}, tempLink[0])
      commit("SET_EDIT_LINK", tempObj)
    },
    SET_CREATE_DETAILS: ({commit}) => {
        const model = {
          id: nanoid(8),
          url: ''
        }
        commit("SET_EDIT_LINK", model)
    },
    FILTER_LINKS: ({
      commit
    }, filterText) => {
      if (filterText && filterText.length > 0) {
        commit("SET_FILTER_TEXT", filterText);
      } else {
        commit("SET_FILTER_TEXT", null);
      }
    },
  },
  getters: {
    SORTED_LINKS: state => {
      return state.filterText ? state.links.filter(link => link.id.toLowerCase().startsWith(state.filterText.toLowerCase())).sort() : state.links.sort()
    },
    ERROR_STATE: state => {
      return state.fetching_error && state.fetchingErrorMessage
    }
  }
}