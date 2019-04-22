import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import login from '../components/login.vue'
import home from '../components/home.vue'

Vue.use(Router)

var router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
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

//设置路由守卫
router.beforeEach((to,from,next)=>{
  //拿到token
  var token = window.sessionStorage.getItem('token')
  //判断登陆
  if (token === null && to.path !== '/login') {
    return next('/login')
  }
  next()
})

export default router















