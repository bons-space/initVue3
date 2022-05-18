import {
  createRouter,
  RouteRecordRaw,
  createWebHistory,
  // createMemoryHistory
} from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'index',
    meta: {
      name: 'index',
    },
    component: () => import('@/view/Index.vue'),
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
