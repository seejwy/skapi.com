import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../views/Main/LandingPage.vue'
import Main from '../views/Main/Main.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Main,
      children:[
        {
          path: '',
          name: 'landingPage',
          component: LandingPage
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('../views/Main/Dashboard.vue'),
        }
      ]
    },
    {
      path: '/dashboard',
      children: [
        {
          path: ':service',
          name: 'service',
          component: () => import('../views/Service/Main.vue'),
          children: [
            {
              path: 'records',
              name: 'records',
              component: () => import('../views/Service/Records.vue'),
            }
          ]
        }
      ]
    }
  ]
})

export default router
