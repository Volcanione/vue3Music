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
    path: "/my",
    name: "My",
    components: {
      layer: () => import("@/views/my/index.vue"),
    },
  },
  {
    path: "/songList",
    name: "SongList",
    components: {
      layer: () => import("@/views/songList/index.vue"),
    },
  },
  {
    path: "/songList/:cat",
    name: "SongListCat",
    components: {
      layer: () => import("@/views/songList/catList.vue"),
    },
    meta: {
      parent: "SongList",
    },
  },
  {
    path: "/songList/:cat/:id",
    name: "SongListDetail",
    components: {
      layer: () => import("@/views/songList/detail.vue"),
    },
    meta: {
      parent: ["SongList", "SearchResult", 'SongListCat', 'My'],
    },
  },
  {
    path: "/singer",
    name: "SingerList",
    components: {
      layer: () => import("@/views/singer/index.vue"),
    }
  },
  {
    path: "/singerDetail/:id",
    name: "SingerDetail",
    components: {
      layer: () => import("@/views/singer/detail.vue"),
    },
      meta: {
      parent: 'SingerList',
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
