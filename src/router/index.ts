import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Recom from "@/views/recom/index.vue";
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/recom",
  },
  {
    path: "/recom",
    name: "Recom",
    component: Recom,
  },
  {
    path: "/hall",
    name: "Hall",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("@/views/hall/index.vue"),
  },
  {
    path: "/radio",
    name: "Radio",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("@/views/radio/index.vue"),
  },
  {
    path: "/login",
    name: "Login",
    components: {
      layer: () => import("@/views/login/index.vue"),
    },
  },
  {
    path: "/search",
    name: "Search",
    components: {
      layer: () => import("@/views/search/index.vue"),
    },
  },
  {
    path: "/searchResult/:keyword",
    name: "SearchResult",
    components: {
      layer: () => import("@/views/search/result.vue"),
    },
    meta: {
      parent: "Search",
    },
  },
  {
    path: "/setting",
    name: "Setting",
    components: {
      layer: () => import("@/views/setting/index.vue"),
    },
  },
  {
    path: "/test",
    name: "Test",
    components: {
      layer: () => import("@/views/setting/test.vue"),
    },
    meta: {
      parent: "Setting",
    },
  },
  {
    path: "/test2",
    name: "Test2",
    components: {
      layer: () => import("@/views/setting/test2.vue"),
    },
    meta: {
      parent: "Test",
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
