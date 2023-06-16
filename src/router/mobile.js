import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '@/views/mobile/Main/LandingPage.vue';
import Main from '@/views/mobile/Main/Main.vue';
import Signup from '@/views/mobile/Main/Signup.vue';
import ServiceMain from '@/views/mobile/Service/Main.vue';
import Service from '@/views/mobile/Service/Service.vue';
import UsersMain from '@/views/mobile/Service/Users/Main.vue';
import Users from '@/views/mobile/Service/Users/Users.vue';
import RecordsMain from '@/views/mobile/Service/Records/Main.vue';
import Tables from '@/views/mobile/Service/Records/Tables.vue';
import TableRecord from '@/views/mobile/Service/Records/TableRecord.vue';
import Admin from '@/views/mobile/Main/Admin.vue';
import Settings from '@/views/mobile/Main/Settings.vue';

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
          component: () => import('@/views/mobile/Main/ForgotPassword.vue')
        },
        {
          path: 'confirmation',
          name: 'confirmation',
          component: () => import('@/views/mobile/Main/ResendConfirmation.vue')
        },
        {
          path: 'success',
          name: 'success',
          component: () => import('@/views/mobile/Main/EmailConfirmed.vue')
        },
        {
          path: 'deleted',
          name: 'deleted',
          component: () => import('@/views/mobile/Main/DeleteConfirmed.vue')
        },
        {
          path: "/:catchAll(.*)",
          name: 'notFound',
          component: () => import('@/views/mobile/Main/404.vue')
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
                  component: ()=>import('@/views/mobile/Service/Records/SearchResult.vue')
                },
                {
                  path: 'mobile-search',
                  name: 'mobileSearchRecord',
                  component: ()=>import('@/views/mobile/Service/Records/MobileSearch.vue')
                },
                {
                  path: 'mobile-view',
                  name: 'mobileRecordView',
                  component: ()=>import('@/views/mobile/Service/Records/MobileViewRecord.vue')
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
                {
                  path: 'user-search',
                  name: 'mobileSearchUser',
                  component: ()=>import('@/views/mobile/Service/Users/MobileSearch.vue')
                },
                {
                  path: 'user/:user_id',
                  name: 'userView',
                  component: ()=>import('@/views/mobile/Service/Users/MobileView.vue')
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
