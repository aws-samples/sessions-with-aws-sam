<template>
  <div class="create-view">
    <h1 class="text-xl bg-blue-900 text-white p-3 rounded my-4">
      Create new link
    </h1>
    <form @submit="createLink">
      <div class="flex">
        <div class="flex-grow">
          <input class="edit-form-input mb-2" v-model="editLink.id" placeholder="Link name" type="text" required />
          <input class="edit-form-input mb-0" v-model="editLink.url" placeholder="Target Url" type="url" required />
        </div>
        <div class="flex-grow-0">
          <button type="submit" class="sm:h-full mb-2 sm:mb-0 px-6 py-2 bg-blue-500 text-white rounded ml-3">
            <span >Create</span>
          </button>
          <button type="button" @click="cancelCreate" class="sm:h-full px-6 py-2 bg-red-400 border-gray-800 rounded ml-3">
            <span>Cancel</span>
          </button>
        </div>
      </div>
    </form>
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
  components:{
    VueQrcode
  },
  data() {
    return {
      baseUrl: process.env.VUE_APP_DOMAIN
    };
  },
  name: "create-view",
  created(){
    this.setDetails(this.$route.params.linkId)
  },
  destroyed(){
    this.$store.commit("SET_EDITING_LINK", false)
    this.$store.commit("CLEAR_ALERT")
  },
  methods:{
    setDetails: function(){
      this.$store.dispatch("SET_CREATE_DETAILS", this.$route.params.linkId)
    },
    createLink: function(e){
      this.$store.dispatch("CREATE_LINK")
      e.preventDefault();
    },
    cancelCreate: function(){
      this.$router.push({name: 'dashboard'})
    }
  },
  computed:{
    ...mapState({
      editLink: state => state.links.editLink,
      editingLink: state => state.links.editingLink
    }),
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
</style>