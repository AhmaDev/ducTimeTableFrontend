import Vue from 'vue'
import VueRouter from 'vue-router'
import Schedules from '../views/Schedules.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Schedules',
    component: Schedules,
  },
  {
    path: '/schedules',
    name: 'Schedules',
    component: Schedules,
  },
  {
    path: '/halls',
    name: 'Halls',
    component: () => import('../views/Halls.vue')
  },
  {
    path: '/schedule',
    name: 'Schedule',
    component:() => import('../components/Schedule.vue')
  },
  {
    path: '/busyHalls',
    name: 'BusyHalls',
    component:() => import('../views/BusyHalls.vue')
  },
  {
    path: '/allBusyHalls',
    name: 'AllBusyHalls',
    component:() => import('../views/AllBusyHalls.vue')
  },
  {
    path: '/logout',
    name: 'Logout',
    component:() => import('../views/Logout.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
