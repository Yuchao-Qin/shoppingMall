// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyload from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import {currency} from  './util/currency'
Vue.config.productionTip = false

import './assets/css/base.css'
import './assets/css/checkout.css'
import './assets/css/login.css'
import './assets/css/product.css'
import Vuex from 'vuex'

Vue.use(Vuex);
Vue.use(VueLazyload,{
  loading:"./../static/loading-svg/loading-bubbles.svg"
});
Vue.filter("currency",currency)
Vue.use(infiniteScroll)

const store = new Vuex.Store({
  state:{
    nickName:'',
    cartCount:0,
    logInit:false
  },
  mutations: {
    updateUserInfo(state,nickName) {
      state.nickName = nickName;
    },
    updateCartCount(state,cartCount) {
      state.cartCount += cartCount;
    },
    initCartCount(state,cartCount) {
      state.cartCount = cartCount
    },
    loginit(state,log) {
      state.logInit = log
    }
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
