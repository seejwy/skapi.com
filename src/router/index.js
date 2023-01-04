import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '../views/Main/LandingPage.vue';
import Login from '../views/Main/Login.vue';
import Main from '../views/Main/Main.vue';
import Dashboard from '../views/Main/Dashboard.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Main,
      children: [
        {
          path: '',
          name: 'home',
          component: LandingPage
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: Dashboard
        },
        {
          path: 'login',
          name: 'login',
          component: Login
        },
        {
          path: "/:catchAll(.*)",
          name: 'notFound',
          component: () => import('../views/Main/404.vue')
        }
      ]
    },
    {
      path: '/dashboard',
      children: [
        {
          path: ':service',
          component: () => import('../views/Service/Main.vue'),
          children: [
            {
              path: '',
              name: 'service',
              component: () => import('../views/Service/Service.vue')
            },
            {
              path: 'records',
              component: () => import('../views/Service/Records/Main.vue'),
              children: [
                {
                  path: '',
                  name: 'records',
                  component: ()=>import('../views/Service/Records/Tables.vue')
                },
                {
                  path: 'search',
                  name: 'recordSearch',
                  component: ()=>import('../views/Service/Records/SearchResult.vue')
                },
                {
                  path: 'search-mobileform',
                  name: 'mobileSearch',
                  component: ()=>import('../views/Service/Records/MobileSearch.vue')
                },
                {
                  path: 'list',
                  name: 'recordList',
                  component: ()=>import('../views/Service/Records/SearchResult.vue')
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  scrollBehavior() {
    // always scroll to top
    return { top: 0 };
  }
});

export default router;
