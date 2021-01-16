// import { createApp } from 'vue'
import App from './App'
import router from './router'
import Vue from 'vue'

// createApp(App).mount('#app')
// new Vue({
//   render: h => h(App),
//   router,
// }).mount('#app')

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
