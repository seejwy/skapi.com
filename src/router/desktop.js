import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '@/views/desktop/Main/LandingPage.vue';
import Signup from '@/views/desktop/Main/Signup.vue';
import Main from '@/views/desktop/Main/Main.vue';
import ServiceMain from '@/views/desktop/Service/Main.vue';
import Service from '@/views/desktop/Service/Service.vue';
import UsersMain from '@/views/desktop/Service/Users/Main.vue';
import Users from '@/views/desktop/Service/Users/Users.vue';
import RecordsMain from '@/views/desktop/Service/Records/Main.vue';
import Tables from '@/views/desktop/Service/Records/Tables.vue';
import TableRecord from '@/views/desktop/Service/Records/TableRecord.vue';
import Admin from '@/views/desktop/Main/Admin.vue';
import Settings from '@/views/desktop/Main/Settings.vue';

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
          path: 'admin',
          name: 'admin',
          component: Admin
        },
        {
          path: 'account-settings',
          name: 'settings',
          component: Settings
        },
        {
          path: 'signup',
          name: 'signup',
          component: Signup
        },
        {
          path: 'forgotpassword',
          name: 'forgotpassword',
          component: () => import('@/views/desktop/Main/ForgotPassword.vue')
        },
        {
          path: 'confirmation',
          name: 'confirmation',
          component: () => import('@/views/desktop/Main/ResendConfirmation.vue')
        },
        {
          path: 'success',
          name: 'success',
          component: () => import('@/views/desktop/Main/EmailConfirmed.vue')
        },
        {
          path: 'deleted',
          name: 'deleted',
          component: () => import('@/views/desktop/Main/DeleteConfirmed.vue')
        },
        {
          path: "/:catchAll(.*)",
          name: 'notFound',
          component: () => import('@/views/desktop/Main/404.vue')
        }
      ]
    },
    {
      path: '/admin',
      children: [
        {
          path: ':service',
          component: ServiceMain,
          children: [
            {
              path: '',
              name: 'service',
              component: Service
            },
            {
              path: 'records',
              component: RecordsMain,
              children: [
                {
                  path: '',
                  name: 'records',
                  component: Tables
                },
                {
                  path: 'search',
                  name: 'recordSearch',
                  component: ()=>import('@/views/desktop/Service/Records/SearchResult.vue')
                },
                {
                  path: 'list',
                  name: 'recordList',
                  component: TableRecord
                }
              ]
            },
            {
              path: 'users',
              component: UsersMain,
              children: [
                {
                  path: '',
                  name: 'users',
                  component: Users
                },
              ]
            },
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
