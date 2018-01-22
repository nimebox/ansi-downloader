import Vue from 'vue'
import Router from 'vue-router'
import Downloader from '@/components/Downloader'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'downloader',
      component: Downloader
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
