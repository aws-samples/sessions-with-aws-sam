<template>
  <div class="detail-view">
    <h1 class="text-xl bg-blue-900 text-white p-3 rounded my-4">
      {{ editLink.id }}
    </h1>
    <form @submit="updateLink">
      <div class="flex">
        <div class="flex-grow">
          <div v-if="!editingLink" class="edit-form-value">{{editLink.url}}</div>
          <div v-else>
            <input class="edit-form-input mb-0" v-model="editLink.url" placeholder="Target Url" type="url" required />
            <p class="text-sm text-gray-600 px-3 py-2 italic">Note: Changes can take up to 15 minutes to take effect</p>
          </div>
        </div>
        <div class="flex-grow-0">
          <button v-if="!editingLink" type="button" @click="setEditing(true)" class="h-full text-gray-700 mx-3"><i class="far fa-edit"></i></button>
          <button v-if="editingLink" type="submit" class="h-full px-6 py-2 bg-blue-500 text-white rounded ml-3">
            <span >Update</span>
          </button>
          <button type="button" v-if="editingLink" @click="setEditing(false)" class="h-full px-6 py-2 bg-red-400 border-gray-800 rounded ml-3">
            <span>Cancel</span>
          </button>
        </div>
      </div>
    </form>
    <a :href="baseUrl + '/' + editLink.id" class="w-full text-center sm:w-auto px-6 py-2 border rounded bg-blue-300 mt-5 hover:bg-blue-600 hover:text-white inline-block" target="_blank" >Try it!</a>
    <button class="w-full sm:w-auto px-6 py-2 border rounded bg-gray-400 mt-5 hover:bg-red-700 hover:text-white sm:ml-2" @click="deleteLink()">Delete link <strong>{{editLink.id}}</strong></button>
    <hr class="border-gray-900 my-4 lg:my-8 border-dashed" />
    <p class="italic"><strong>{{editLink.clicks | formatNumber }}</strong> {{pluralizer('click')}} from <strong>{{regionsData.length}}</strong> {{pluralizer('region')}} </p>
    <div v-if="editLink.clicks" class="border border-gray-600">
      <div class="bg-gray-400 py-2 px-2">
        <div v-for="region in regionsData" v-bind:key="region.code">
        <div class="mb-1">{{region.code}} {{region.clicks | formatNumber}} | {{region.percentage | formatPercent}}</div>
        <div v-bind:style="region.classObject" class="bar p-1 bg-gradient-to-r from-blue-700 to-blue-600"></div>
        </div>
      </div>
    </div>
    <hr class="border-gray-900 my-4 lg:my-8 border-dashed" />
    <div class="qr-wrap mt-4">
      <vue-qrcode v-if="editLink.id" :value="baseUrl + '/' + editLink.id" :scale="4" />
      <vue-qrcode v-if="editLink.id" :value="baseUrl + '/' + editLink.id" :scale="12" />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import VueQrcode from 'vue-qrcode'

export default {
  name: "detail-view",
  components:{
    VueQrcode,
  },
  data() {
    return {
      baseUrl: process.env.VUE_APP_DOMAIN,
    };
  },
  created(){
    this.setDetails(this.$route.params.linkId)
  },
  destroyed(){
    this.$store.commit("SET_EDITING_LINK", false)
    this.$store.commit("CLEAR_ALERT")
  },
  methods:{
    setDetails: function(){
      this.$store.dispatch("SET_DETAILS", this.$route.params.linkId)
    },
    setEditing: function(value){
      if(!value) this.setDetails()
      this.$store.commit("SET_EDITING_LINK", value);
    },
    updateLink: function(e){
      this.$store.dispatch("UPDATE_LINK")
      e.preventDefault();
    },
    deleteLink: function(){
      if(confirm(`Are you sure you want to delete ${this.editLink.id}`)){
        this.$store.dispatch("DELETE_LINK")
      }
    },
    pluralizer: function(value){
      return this.regionsData.length == 1 ? `${value}` : `${value}s`;
    }
  },
  computed:{
    ...mapState({
      editLink: state => state.links.editLink,
      editingLink: state => state.links.editingLink
    }),
    regionsData(){
      let updatedData = []
      let regionKeys = Object.keys(this.editLink.regions)
      regionKeys.map(regionKey => {
        let p = this.editLink.regions[regionKey]/this.editLink.clicks
        updatedData.push({
          code: regionKey,
          clicks: this.editLink.regions[regionKey],
          percentage: p,
          classObject: {
            width: `${p*100}%`
          }
        })
      })
      return updatedData;
    }
  }
}
</script>
<style lang="postcss" scoped>
.edit-form-input{@apply border border-blue-300 px-3 py-2 rounded bg-white bg-opacity-50 leading-none w-full}
.edit-form-value{@apply border border-blue-300 px-3 py-2 rounded bg-white bg-opacity-25 leading-none w-full}

.qr-wrap img{@apply pb-5}
@screen lg{
  .qr-wrap img{@apply inline pr-5 pb-0}
}
.bar{
    text-shadow: 1px 1px 2px #000000;
  }
</style>