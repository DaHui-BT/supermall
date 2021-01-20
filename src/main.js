// import { createApp } from 'vue'
import App from './App'
import router from './router'
import Vue from 'vue'
import store from './store'

import FastClick from 'fastclick'
import VueLazyLoad from "vue-lazyload";

import toast from 'components/common/toast'

// createApp(App).mount('#app')
// new Vue({
//   render: h => h(App),
//   router,
// }).mount('#app')

Vue.prototype.$bus = new Vue()

// 安装toast插件
Vue.use(toast)

// 使用懒加载的插件
Vue.use(VueLazyLoad, {
  loading: require('assets/img/common/placeholder.png')
})

// 解决移动端300ms延迟
FastClick.attach(document.body)

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')
