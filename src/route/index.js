// OUR ROUTE RULES
import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../views/LoginPage.vue'
import TimetablePage from '../views/TimetablePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: LoginPage
    },
    {
      path: '/timetable',
      name: 'Timetable',
      component: TimetablePage
    }
  ]
})

export default router
