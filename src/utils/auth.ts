// @ts-ignore
import Cookies from 'js-cookie';

const TokenKey = 'token';

export const getToken = () => Cookies.get(TokenKey);
