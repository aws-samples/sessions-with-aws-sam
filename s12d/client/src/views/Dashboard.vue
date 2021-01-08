<template>
  <div class="dashboard">
    <div v-if="isEmpty" class="text-4xl text-center py-20">You have no short links, click the <router-link class="nav-link" :to="{ name: 'create'}" title="New shortcut">
              <i class="fas fa-plus"></i>
            </router-link> to add one.</div>
    <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-2 md:grid-cols-3 md:gap-3 lg:gap-4">
      <div class="bg-white border-1 border-blue-200 shadow" v-for="link in SORTED_LINKS" v-bind:key="link.id">
        <div class="text-lg font-medium bg-gradient-to-r text-white from-blue-500 to-blue-600 p-3">
          <div class="float-right">{{link.clicks | formatNumber}}</div>
          {{link.id}}
        </div>
        <div class="items-center p-3 relative">
          <div>
            <div class="font-thin truncate mr-10">
              {{link.url}}
            </div>
            <div class="text-xs font-thin italic pt-2">
              {{ link.timestamp | formatDate }}
            </div>
          </div>
        </div>
        <div class="flex justify-items-auto">
          <router-link title="Edit link" class="sub-link" :to="{ name: 'details', params: { linkId: link.id }}">
              <i class="far fa-edit"></i> Details
            </router-link>
            <button title="Copy link" class="sub-link" v-clipboard="baseUrl + '/' + link.id" v-clipboard:success="clipboardSuccessHandler" v-clipboard:error="clipboardErrorHandler">
              <span v-if="(baseUrl + '/' + link.id) === clip" class="italic text-blue-500">...copied to clipboard</span>
              <span v-else>
              <i class="far fa-copy"></i> Copy to clipboard
              </span>
            </button>
            <a title="Go to link" class="sub-link" :href="baseUrl + '/' + link.id" target="_blank">
              <i class="fas fa-external-link-alt"></i> Try it!
            </a>
        </div>
      </div>
    </div>
    <div>
      <button class="block border border-blue-500 bg-blue-500 bg-opacity-50 py-4 my-8 rounded w-full" v-if="lastKeyFetched" v-on:click="fetchData()">Load more</button>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  name: "dashboard",
  data() {
    return {
      baseUrl: process.env.VUE_APP_DOMAIN,
      clip: ''
    };
  },
  computed: {
    ...mapState({
      lastKeyFetched: state => state.links.lastKeyFetched
    }),
    ...mapGetters(['SORTED_LINKS']),
    isEmpty(){
      return this.SORTED_LINKS.length == 0
    }
  },
  methods: {
    fetchData: function(){
      this.$store.dispatch('FETCH_DATA');
    },
    clipboardSuccessHandler ({value}) {
      this.clip = value;
      setTimeout(() => this.clip = '', 2500);
    },

    clipboardErrorHandler () {
      alert(`Error: Could not copy to the clipboard`)
    }
  }
};
</script>

<style lang="postcss" scoped>
.nav-link {@apply border px-3 py-1 rounded bg-gray-400 border-white bg-opacity-25 shadow-md inline-block}
.nav-link:hover {@apply bg-opacity-75 }
.sub-link{@apply text-sm text-center flex-auto py-2 bg-white border-blue-200 border text-gray-500}
.sub-link:hover{@apply text-blue-500}
</style>