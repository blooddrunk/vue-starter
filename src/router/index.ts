import { createRouter, createWebHistory } from 'vue-router';
import NProgress from 'nprogress';

export const routerHistory = createWebHistory();

// ? how to type a route meta?
export type RouteMeta = {
  layout?: 'default' | 'error' | 'empty';
};

export const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },

  {
    path: '/simple-list',
    name: 'SimpleList',
    component: () => import('../views/SimpleList.vue'),
  },

  {
    path: '/counter',
    name: 'Counter',
    component: () => import('../views/Counter.vue'),
  },

  {
    path: '/simple-form',
    name: 'SimpleForm',
    component: () => import('../views/SimpleForm.vue'),
  },

  {
    path: '/404',
    name: '404',
    meta: {
      layout: 'error',
    } as RouteMeta,
    component: () => import('../views/Error.vue'),
  },

  // !FIXME: error
  // {
  //   path: '*',
  //   redirect: { name: '404' },
  // },
];

const router = createRouter({
  history: routerHistory,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.name) {
    NProgress.start();
  }
  next();
});

router.afterEach(() => {
  NProgress.done();
});

export { router };
