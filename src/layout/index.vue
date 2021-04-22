<template>
  <div class="root">
    <div class="header">
      <Navbar @changeRoute="changeRoute" />
    </div>
    <div class="wrapper">
      <ViewContent :type="routeType" :disabled="disabled" />
    </div>
  </div>
</template>
<script lang="ts">
import Navbar from "./components/Navbar.vue";
import ViewContent from "@/components/ViewContent/index.vue";
import { defineComponent, ref } from "vue";
export default defineComponent({
  components: {
    Navbar,
    ViewContent,
  },
  data() {
    return {
      x: 0 as any,
      left: 0 as any,
      disabled: false,
    };
  },
  setup() {
    const routeType = ref(0);
    const changeRoute = (val: number) => {
      routeType.value = val;
    };
    return {
      changeRoute,
      routeType,
    };
  },
  computed: {
    // disabled() {
    //   const nowRouter: any = this.$route.matched.find(
    //     (route) => route.name === this.$route.name
    //   )
    //   return Boolean(nowRouter?.components?.layer)
    // },
  },
  watch: {
    $route(to, from) {
      const toRouter: any = to.matched.find(
        (route: any) => route.name === to.name
      );
      const fromRoute: any = from.matched.find(
        (route: any) => route.name === from.name
      );
      this.disabled = Boolean(
        toRouter?.components?.layer || fromRoute?.components?.layer
      );
    },
  },
  methods: {},
});
</script>
<style lang="scss" scoped>
@import "~@/style/layout.scss";
.root {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #{$appBackColor};
  .header {
    overflow: hidden;
  }
  .wrapper {
    flex: 1;
    overflow: hidden;
  }
}
</style>
