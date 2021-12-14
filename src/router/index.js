import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from "../components/Home"
import Welcome from '../components/Welcome'
import Users from '../components/users/Users'
import Rights from '../components/power/Rights'
import Roles from '../components/power/Roles'
import Categories from '../components/goods/Categories'
import Params from '../components/goods/Params'
import List from '../components/goods/List'
import Add from '../components/goods/Add'
import Order from '../components/order/Order'
import Report from '../components/report/Report'
//用户来源echarts图表
import UserResourceLine from '../components/echarts/UserResourceLine'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    //访问网页，重定向为登录页面
    { path: '/', redirect: '/login' },
    //访问数据报表重定向为 用户echarts图表
    {path:'/reports', redirect: '/userresourceline'},
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
        { path: '/roles', component: Roles },
        { path: '/categories', component: Categories },
        { path: '/params' , component: Params },
        { path: '/goods', component: List },
        { path: '/goods/addpage', component: Add},
        { path: '/orders', component: Order},
        { path: '/reports', component: Report,
          children:[{path: '/userresourceline',component: UserResourceLine}]
        }
      ],
      //进入 home 重定向为 welcome
      redirect: '/welcome'
    }
  ]
})

export default router
