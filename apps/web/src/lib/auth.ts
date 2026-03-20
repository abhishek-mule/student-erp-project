import Cookies from 'js-cookie';

const ACCESS_TOKEN_KEY = 'college_erp_access_token';
const REFRESH_TOKEN_KEY = 'college_erp_refresh_token';

export const setTokens = (accessToken: string, refreshToken: string) => {
  Cookies.set(ACCESS_TOKEN_KEY, accessToken, { expires: 1, secure: true, sameSite: 'strict' });
  Cookies.set(REFRESH_TOKEN_KEY, refreshToken, { expires: 7, secure: true, sameSite: 'strict' });
};

export const getAccessToken = () => Cookies.get(ACCESS_TOKEN_KEY);
export const getRefreshToken = () => Cookies.get(REFRESH_TOKEN_KEY);

export const clearTokens = () => {
  Cookies.remove(ACCESS_TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
};

export const isAuthenticated = () => !!getAccessToken();
