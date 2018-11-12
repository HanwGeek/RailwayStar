import Vue from 'vue'
import Router from 'vue-router'
import MainFrame from '@/components/MainFrame'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: MainFrame
    }
  ]
})
