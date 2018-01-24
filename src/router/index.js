import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from '@/view/GoodsList.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'GoodsList',
      component: GoodsList
    }
  ]
})
