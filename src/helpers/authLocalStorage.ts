interface Props {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export const AuthLocalStorage = (data: Props): void => {
  window.localStorage.setItem('accessToken', data.accessToken);
  window.localStorage.setItem('refreshToken', data.refreshToken);
  window.localStorage.setItem('expiresAt', data.expiresAt);
  window.localStorage.setItem('isBannerOpen', 'true');
};
