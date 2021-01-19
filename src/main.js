// import { createApp } from 'vue'
import App from './App'
import router from './router'
import Vue from 'vue'
import store from './store'

// createApp(App).mount('#app')
// new Vue({
//   render: h => h(App),
//   router,
// }).mount('#app')

Vue.prototype.$bus = new Vue()

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')
