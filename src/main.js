import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
