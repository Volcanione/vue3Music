const getters = {
  token: (state: any) => state.user.token,
  loginState: (state: any) => state.user.loginStatus,
  userInfo: (state: any) => state.user.userInfo,
};
export default getters;
