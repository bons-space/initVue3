import { createStore } from 'vuex';
import VuexPersistence from 'vuex-persist';
import { user } from '@/store/module/user';

const persistedState = new VuexPersistence({ // 数据持久化
  storage: window.sessionStorage,
  modules: ['user'],
});

const store = createStore({
  plugins: [persistedState.plugin],
  modules: {
    user,
  },
});

export default store;
