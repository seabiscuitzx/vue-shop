import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
// 引入axios
import axios from 'axios'
// axios配置请求公共根地址
axios.defaults.baseURL = 'http://127.0.0.1:11333/api/private/v1/'
// 给axios配置成为Vue的成员
Vue.prototype.$http = axios
Vue.config.productionTip = false
import ElementUI from 'element-ui'
Vue.use(ElementUI)

//设置拦截器
axios.interceptors.request.use(function (config) {
  var token = window.sessionStorage.getItem('token')
  if (token != null) {
    config.headers.Authorization = token
  }
  // console.log(config)
  return config;
}, function (error) {
  return Promise.reject(error);
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
