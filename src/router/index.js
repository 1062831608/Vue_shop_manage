import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from "../components/Home"

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      //独享路由守卫,判断是否处于登录状态
      beforeEnter(to,from,next){
        if(to.path === '/login') return next()
        const tokenStr = window.sessionStorage.getItem('token')
        if(!tokenStr) next('/login')
        next()
      }
    }
  ]
})

export default router
