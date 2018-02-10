import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from '@/view/GoodsList.vue'
import Cart from '@/view/cart.vue'
import address from '@/view/address.vue'
import orderConfirm from '@/view/orderConfirm.vue'
import orderSuccess from '@/view/orderSuccess.vue'
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
    },
    {
      path: '/address',
      name: 'address',
      component: address
    },
    {
      path: '/orderConfirm',
      name: 'orderConfirm',
      component: orderConfirm
    },
    {
      path: '/orderSuccess',
      name: 'orderSuccess',
      component: orderSuccess
    }
  ]
})
