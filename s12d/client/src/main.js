// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this
// software and associated documentation files (the "Software"), to deal in the Software
// without restriction, including without limitation the rights to use, copy, modify,
// merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
// PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import moment from 'moment'
import numeral from 'numeral'
import '@/assets/tailwind.css'
import Clipboard from 'v-clipboard'

Vue.use(Clipboard)
Vue.config.productionTip = false

// filters
Vue.filter('formatDate', function (value) {
  return moment(value, 'DD/MMM/YYYY:HH:mm:ss Z').format("YYYY-MM-DD hh:mm a");
})
Vue.filter('formatNumber', function(value) {
  return numeral(value).format('0,0');
})
Vue.filter('formatPercent', function(value) {
  return numeral(value).format('0.00%');
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
