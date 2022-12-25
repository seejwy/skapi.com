import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../views/LandingPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LandingPage
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/Dashboard.vue'),
    },
    {
      path: '/service/:service',
      name: 'service',
      component: () => import('../views/ServicePage/Service.vue'),
      children: [
        {
          path: '/records',
          name: 'records',
          component: () => import('../views/ServicePage/Records.vue'),
        }
      ]
    }
  ]
})

export default router
