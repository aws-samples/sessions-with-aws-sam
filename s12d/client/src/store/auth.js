import axios from 'axios';
import router from '@/router'
const queryStringParams = new URLSearchParams(window.location.search);
const clientId = process.env.VUE_APP_CLIENT_ID;
const authDomain = process.env.VUE_APP_AUTH_DOMAIN;
const redUrl = window.location.origin;

function convertJSON(json) {
  const oAuthTokenBodyArray = Object.entries(json).map(([key, value]) => {
    const encodedKey = encodeURIComponent(key);
    const encodedValue = encodeURIComponent(value);
    return `${encodedKey}=${encodedValue}`;
  });
  return oAuthTokenBodyArray.join("&");
}

const state = {
  authorized: false,
  authorizing: false,
  hasExchangeTokenError: false,
  signUpUrl: `${authDomain}/signup?response_type=code&client_id=${clientId}&redirect_uri=${redUrl}`,
  logInUrl: `${authDomain}/login?response_type=code&client_id=${clientId}&redirect_uri=${redUrl}`,
  logOutUrl: `${authDomain}/logout?client_id=${clientId}&logout_uri=${redUrl}`,
}

export default {
  state,
  mutations: {
    START_AUTHORIZING(state) {
      state.authorizing = true;
    },
    SET_AUTHORIZED(state) {
      state.authorized = true;
      state.authorizing = false;
      state.hasEschangeTokenError = false;
    },
    SET_UNAUTHORIZED(state) {
      state.authorized = false;
      state.authorizing = false;
      state.hasEschangeTokenError = false;
    },
    EXCHANGE_TOKEN_ERROR(state) {
      state.authorized = false;
      state.hasExchangeTokenError = true;
    }
  },
  actions: {
    EXCHANGE_TOKEN: async ({
      commit
    }) => {
      commit('START_AUTHORIZING');
      const oauthTokenBodyJson = {
        grant_type: "authorization_code",
        client_id: process.env.VUE_APP_CLIENT_ID,
        code: queryStringParams.get("code") || null,
        redirect_uri: window.location.origin
      };
      const oauthTokenBody = convertJSON(oauthTokenBodyJson);
      return axios.post(`${process.env.VUE_APP_AUTH_DOMAIN}/oauth2/token`, oauthTokenBody, {
        ["Content-Type"]: "application/x-www-form-urlencoded",
      })
    },
    REFRESH_TOKEN: async ({
      commit
    }) => {
      commit('START_AUTHORIZING');
      const oauthTokenBodyJson = {
        grant_type: "refresh_token",
        client_id: process.env.VUE_APP_CLIENT_ID,
        refresh_token: localStorage.getItem("cognitoRefreshToken"),
      };
      const oauthTokenBody = convertJSON(oauthTokenBodyJson);
      return axios.post(`${process.env.VUE_APP_AUTH_DOMAIN}/oauth2/token`, oauthTokenBody, {
        ["Content-Type"]: "application/x-www-form-urlencoded",
      })
    },
    RUN_AUTHORIZE_PROCESS: ({
      commit
    }, payload) => {
      let json = payload.response.data;
      if (json.id_token) {
        localStorage.setItem("cognitoIdentityToken", json.id_token);
        if (json.refresh_token) localStorage.setItem("cognitoRefreshToken", json.refresh_token);
        commit('SET_AUTHORIZED');
      }
      let query = Object.assign({}, payload.route.query);
      if (query.code) {
        delete query.code;
        router.replace({
          query
        });
      }
    },
    RUN_DEAUTHORIZE_PROCESS: ({
      commit
    }) => {
      commit('SET_UNAUTHORIZED')
      commit('EXCHANGE_TOKEN_ERROR')
    },
    LOGOUT: async ({
      commit
    }) => {
      commit('START_AUTHORIZING');
      localStorage.removeItem("cognitoIdentityToken");
      localStorage.removeItem("cognitoRefreshToken");
      commit('SET_UNAUTHORIZED')
      window.location = state.logOutUrl;
    }
  },
  getters: {
    IS_AUTHORIZED: state => {
      return !state.authorizing && state.authorized
    }
  }
}