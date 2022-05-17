import {
  createRouter,
  RouteRecordRaw,
  createWebHistory,
  // createMemoryHistory
} from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'login',
    meta: {
      name: '登录',
    },
    component: () => import('@/view/Login.vue'),
    children: [],
  },
  {
    path: '/*',
    name: '404',
    redirect: '/login',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
