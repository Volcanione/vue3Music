const getters = {
  token: (state: any) => state.user.token,
  loginState: (state: any) => state.user.loginStatus,
};
export default getters;
