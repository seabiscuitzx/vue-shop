import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import login from '../components/login.vue'
import home from '../components/home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '/login',
      component: login
    },
    {
      path:'/login',
      component:login
    },
    {
      path:'/home',
      component:home
    }
  ]
})
