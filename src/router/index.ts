import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import NProgress from 'nprogress';

export const routerHistory = createWebHistory(process.env.BASE_URL);

declare module 'vue-router' {
  interface RouteMeta {
    layout?: 'Default' | 'Error' | 'Empty';
  }
}

export const routes: RouteRecordRaw[] = [
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
    path: '/directive-intersection-observer',
    name: 'DirectiveIntersectionObserver',
    component: () => import('../views/DirectiveIntersectionObserver.vue'),
  },

  {
    path: '/lazy-image',
    name: 'LazyImage',
    component: () => import('../views/LazyImage.vue'),
  },

  {
    path: '/element-ui',
    name: 'ElementUI',
    component: () => import('../views/ElementUI.vue'),
  },

  {
    path: '/404',
    name: '404',
    meta: {
      layout: 'Error',
    },
    component: () => import('../views/Error.vue'),
  },

  // !FIXME: error
  {
    path: '/:catchAll(.*)*',
    redirect: { name: '404' },
  },
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
