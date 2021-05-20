<template>
  <LayerPage>
    <template #header>
      <Nav> 登录 </Nav>
    </template>
    <template #content>
      <div class="login">
        <Field v-model="form.user" class="field" placeholder="手机或邮箱" />
        <Field
          v-model="form.password"
          class="field"
          type="password"
          placeholder="密码"
        />
        <div class="sumbit" @click="login">登录</div>
      </div>
    </template>
  </LayerPage>
</template>
<script lang="ts">
import { defineComponent, reactive,getCurrentInstance } from "vue";
import { getUserType } from "@/utils/index";
// import { $msg } from "@/components/Msg/index";
import api from "@/api/user";
import { useRouter } from "vue-router";
import {setCookie} from '@/utils'
export default defineComponent({
  name: "login",
  data() {
    return {};
  },
  setup() {
     const { ctx }: any = getCurrentInstance()
    const router = useRouter();
    const form = reactive({
      user: "",
      password: "",
    });
    const login = async () => {
      if (!form.user || !form.password) {
        return ctx.$msg({ title: "账号或密码不能为空" });
      }
      const type = getUserType(form.user);
      if (!type) {
        return ctx.$msg({ title: "账号格式错误" });
      }
      const param = {
        [type]: form.user,
        password: form.password,
      };
      const res = await api.login(param);
      if (res.code !== 200) {
        return;
      }
      setCookie('cookie',res.cookie)
      await ctx.$msg({ title: "登录成功" });
      router.replace("/");
    };
    return {
      form,
      login,
    };
  },
  methods: {},
});
</script>

<style lang="scss" scoped>
.login {
  overflow: hidden;
  padding: 10px;
  .field {
    background: #fff;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 10px;
  }
  .sumbit {
    padding: 0 10px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    cursor: pointer;
    background: #408e94;
    color: #fff;
  }
}
</style>
