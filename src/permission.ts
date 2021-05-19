
import router from "./router";
import store from "./store";

const WHITElIST = ["Hall", "Recom", "Radio"];

router.beforeEach(async (to: any, from: any, next: (path?: any) => void) => {


  if (to.name === 'My') {
    try {
      await store.dispatch("user/getLoginStatus");
    } catch (error) {
      return next('login');
    }

  }

  if (
    !WHITElIST.includes(from.name) &&
    from.name &&
    !WHITElIST.includes(to.name) &&
    to.name
  ) {
    setRoutePage(to, from);
  }
  next();
});

const routePage: Array<any> = [];
function setRoutePage(to: any, from: any) {
  const fromIdx = routePage.findIndex((route: any) => route.name === from.name);
  if (fromIdx !== -1) {
    routePage.splice(fromIdx, 1);
  }
  routePage.unshift(from);
  const { parent } = to?.meta || {};
  const LastPath = routePage.find((item: any) => item.name === parent);
  store.commit("route/setLastPath", LastPath);
}
