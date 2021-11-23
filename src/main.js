import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 引入全局样式表global
import './assets/css/global.css'
//导入表格树形插件
import ZkTable from 'vue-table-with-tree-grid'
//导入axios
import axios from 'axios'
//配置axios请求跟路径
axios.defaults.baseURL="http://127.0.0.1:8888/api/private/v1/"
//设置axios拦截器，保证授权才可以访问授权接口
axios.interceptors.request.use(config=>{
  config.headers.Authorization = window.sessionStorage.getItem('token')
  //必须要返回 config
  return config
})
//Vue原型上挂载axios
Vue.prototype.$http = axios
Vue.config.productionTip = false

//注册组件
Vue.component('tree-table', ZkTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
