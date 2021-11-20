import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from "../components/Home"
import Welcome from '../components/Welcome'
import Users from '../components/users/Users'
import Rights from '../components/power/Rights'
import Roles from '../components/power/Roles'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    //访问网页，重定向为登录页面
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
      },
      children:[
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles }
      ],
      //进入 home 重定向为 welcome
      redirect: '/welcome'
    }
  ]
})

export default router
