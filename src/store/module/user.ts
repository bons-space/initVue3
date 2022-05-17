import { UserInfo } from '@/types/store/user';
import { getUserInfo, logout } from '@/api/user';

export const user = {
  state(): UserInfo | null {
    return null;
  },
  mutations: {
    setUserInfo(state: any, data: UserInfo | null) {
      state.user = data;
    },
  },
  actions: {
    async getUserInfo(context: any) {
      const { data, code, msg } = await getUserInfo();
      if (code !== 0) {
        console.error(msg);
        return;
      }
      context.commit('setUserInfo', data);
    },
    async logout(context: any) {
      await logout();
      context.commit('setUserInfo', null);
    },
  },
  getters: {
    info(state: any) {
      return state.user;
    },
  },
};
