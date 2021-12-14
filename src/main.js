import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

//引入时间格式过滤器
import moment from 'moment'

// 引入全局样式表global
import './assets/css/global.css'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
//导入富文本全局样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
//将富文本注册全局组件
Vue.use(VueQuillEditor)

//导入echarts图表
let echarts = require('echarts')
//原型挂载echarts
Vue.prototype.$echarts = echarts

//导入表格树形插件
import ZkTable from 'vue-table-with-tree-grid'

//导入axios
import axios from 'axios'

//配置axios请求跟路径
axios.defaults.baseURL="http://127.0.0.1:12004/api/private/v1/"

//设置axios拦截器，保证授权才可以访问授权接口
axios.interceptors.request.use(config=>{
  config.headers.Authorization = window.sessionStorage.getItem('token')
  //必须要返回 config
  return config
})
//Vue原型上挂载axios
Vue.prototype.$http = axios
Vue.config.productionTip = false

//定义全局过滤器，格式化时间
Vue.filter('datefmt',function (input,fmtstring) {//当input为时间戳时，需转为Number类型
  // 使用momentjs这个日期格式化类库实现日期的格式化功能
  return moment(input*1).format(fmtstring)})

//注册组件
Vue.component('tree-table', ZkTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
