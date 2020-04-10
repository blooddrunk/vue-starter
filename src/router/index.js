import { createRouter, createWebHistory } from 'vue-router';

export const routerHistory = createWebHistory();

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
];

export const router = createRouter({
  history: routerHistory,
  routes,
});
