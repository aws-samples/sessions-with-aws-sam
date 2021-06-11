<!-- Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: MIT-0 -->

<template>
  <div id="app">
    <nav class="mt-0 fixed w-full top-0 shadow-lg z-50">
      <div class="bg-gradient-to-r from-gray-800 to-gray-600 flex items-center justify-between px-2 sm:px-5 h-8 sm:h-20">
        <p class="text-lg sm:text-2xl md:text-3xl text-white">{{ appTitle }}</p>
        <div class="hidden lg:block">
          <div v-if="IS_AUTHORIZED">
            <input class="nav-input mr-2" v-model="filterText" placeholder="Filter" @keyup="filter()" />
            <router-link class="nav-link mr-2" :to="{ name: 'create'}" title="New shortcut">
              <i class="fas fa-plus"></i>
            </router-link>
            <router-link class="nav-link" :to="{ name: 'dashboard'}">
              <i class="fas fa-home"></i>
            </router-link>
            <i class="text-white text-opacity-50 fas fa-ellipsis-v mx-3"></i>
            <button class="nav-link" @click="logout()"><i class="fas fa-sign-out-alt"></i></button>
          </div>
          <div v-if="!IS_AUTHORIZED">
            <a class="nav-btn" :href="signUpUrl">Sign Up</a>
            <a class="nav-btn ml-3" :href="logInUrl">Login</a>
          </div>
        </div>
      </div>
    </nav>
    <div class="mt-8 sm:mt-20">
      <div class="container mx-auto">
        <div v-if="missingLink" class="bg-blue-300 p-4 sm:p-8 mt-40 -mb-20 mx-4 rounded-lg shadow-md">
          Whoops, that doesn't seem to be an active link.
        </div>
        <div v-if="IS_AUTHORIZED" class="px-3 sm:px-0 pt-3">
          <div v-if="ERROR_STATE" class="flex justify-between bg-red-400 rounded text-white px-3 py-5 text-xl">
            <div>{{ errorMessage }}</div>
            <button @click="clearAlert()"><i class="fas fa-window-close"></i></button>
          </div>
          <router-view v-if="!isFetchingInitialData" />
          <div v-else>Loading</div>
        </div>
        <div v-else>
            <main v-if="!isAuthorizing" class="bg-white p-4 sm:p-8 mt-12 mx-4 sm:mt-24 rounded-lg shadow-md">
              <div class="sm:text-center lg:text-left">
                <h2 class="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-5xl sm:leading-none">
                  <p class="text-gray-600">
                  Welcome to
                  </p>
                  <p class="text-blue-800">
                    {{ appTitle }}
                  </p>
                </h2>
                <p class="mt-4">
                  The <a href="https://serverlessland.com" target="_blank">Serverless Land</a> URL shortener built using less code.
                </p>
                <p class="mt-12 mb-6">
                  <a class="hero-btn" :href="signUpUrl">Sign Up</a>
                  <a class="hero-btn ml-2" :href="logInUrl">Login</a>
                </p>
              </div>
            </main>
        </div>
      </div>
    </div>
    <nav v-if="IS_AUTHORIZED" class="fixed bottom-0 w-full z-50 lg:hidden">
      <div class="bg-gradient-to-r from-gray-800 to-gray-600 flex items-center justify-between px-2 h-16">
        <div>
          <input class="nav-input w-full" v-model="filterText" placeholder="Filter" @keyup="filter()" />
        </div>
        <div>
          <router-link class="bottom-nav-link mr-1" :to="{ name: 'create'}" title="New shortcut">
            <i class="fas fa-plus"></i>
          </router-link>
          <router-link class="bottom-nav-link mr-1" :to="{ name: 'dashboard'}">
              <i class="fas fa-home"></i>
            </router-link>
          <button class="bottom-nav-link" @click="logout()"><i class="fas fa-sign-out-alt"></i></button>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex'
const queryStringParams = new URLSearchParams(window.location.search);
const cognitoCode = queryStringParams.get("code") || null;

export default {
  name: "app",
  data() {
    return {
      filterText: null,
      appName: `Magic ${process.env.VUE_APP_NAME}`,
      appTitle: process.env.VUE_APP_TITLE,
    };
  },
  mounted() {
    if(this.$route.query["link-not-found"]) this.$store.commit("SET_MISSING_LINK", true)
    if (cognitoCode) this.exchange();
    else if(localStorage.getItem("cognitoRefreshToken")) this.refresh();
  },
  destroyed(){
    this.$store.commit("SET_MISSING_LINK", false)
  },
  computed: {
    ...mapState({
      signUpUrl: state => state.auth.signUpUrl,
      logInUrl: state => state.auth.logInUrl,
      logOutUrl: state => state.auth.logOutUrl,
      isAuthorizing: state => state.auth.authorizing,
      isFetchingInitialData: state => state.links.fetchingInitialData,
      errorMessage: state => state.links.fetchingErrorMessage,
      missingLink: state => state.links.missingLink
    }),
    ...mapGetters(['IS_AUTHORIZED', 'ERROR_STATE'])
  },
  methods: {
    exchange: function(){
      this.$store.dispatch('EXCHANGE_TOKEN')
        .then(response => {
          this.$store.dispatch('RUN_AUTHORIZE_PROCESS', {response:response, route: this.$route})
          this.$store.dispatch('FETCH_DATA');
        })
        .catch(() => {
          this.$store.dispatch('RUN_DEAUTHORIZE_PROCESS')
        })
    },
    refresh: function(){
      this.$store.dispatch('REFRESH_TOKEN')
      .then(response => {
          this.$store.dispatch('RUN_AUTHORIZE_PROCESS', {response:response, route: this.$route})
          this.$store.dispatch('FETCH_DATA');
        })
        .catch(() => {
          this.$store.dispatch('RUN_DEAUTHORIZE_PROCESS')
        })
    },
    logout: function(){
      this.$store.dispatch('LOGOUT');
    },
    filter: function(){
      this.$store.dispatch('FILTER_LINKS', this.filterText)
    },
    clearAlert: function(){
      this.$store.commit("CLEAR_ALERT")
    }
  }
};
</script>

<style lang="postcss" scoped>
.nav-btn, .nav-link {@apply border px-3 py-2 rounded bg-white bg-opacity-50 shadow-md inline-block}
.nav-btn:hover, .nav-link:hover {@apply bg-opacity-75 }
.bottom-nav-link{@apply border px-2 py-1 rounded bg-white bg-opacity-50 shadow-md inline-block}
.nav-input{@apply border px-3 py-2 rounded shadow-md inline-block}
.hero-btn {@apply px-5 py-3 border bg-blue-600 text-white rounded shadow-md}
.hero-btn:hover {@apply bg-blue-400}
</style>