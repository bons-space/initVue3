import { createApp } from 'vue';
import App from './App.vue';
import router from '@/router';
import store from '@/store';

import { ClickOutside } from 'element-plus'

import '@/assets/style/common.scss';
import 'element-plus/dist/index.css'

createApp(App)
  .use(router)
  .directive('clickoutside', ClickOutside)
  .use(store)
  .mount('#app');
