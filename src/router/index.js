import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from '@/view/GoodsList.vue'
import Cart from '@/view/cart.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'GoodsList',
      component: GoodsList
    },
    {
      path: '/cart',
      name: 'Cart',
      component: Cart
    }
  ]
})
