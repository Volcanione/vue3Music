<template>
  <div class="Field" :class="{ disabled: disabled }">
    <span v-if="label && !$slots.label" class="label">{{ label }}</span>
    <slot name="label" :class="{ disabled: disabled }" />
    <input
      :type="type"
      v-model="val"
      :placeholder="placeholder"
      :autocomplete="false"
      @keyup.enter="$emit('enter')"
      :disabled="disabled"
    />
    <slot name="right" :class="{ disabled: disabled }" />
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "Field",
  props: {
    disabled: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    modelValue: {
      type: [String, Number] as PropType<string> | PropType<number>,
      required: true,
    },
    placeholder: {
      type: [String, Number] as PropType<string> | PropType<number>,
      default: "请输入",
    },
    label: {
      type: [String, Number] as PropType<string> | PropType<number>,
      required: false,
    },
    type: {
      type: String as PropType<string>,
      default: "text",
      validator: function (value: string) {
        return ["text", "password"].indexOf(value) !== -1;
      },
    },
  },
  computed: {
    val: {
      get(): any {
        return this.modelValue;
      },
      set(val: any) {
        this.$emit("update:modelValue", val);
      },
    },
  },
});
</script>

<style lang="scss" scoped>
.Field {
  display: flex;
  height: 35px;
  width: 100%;
  align-items: center;
  &.disabled {
    input {
      color: #999 !important;
    }
    :deep(.iconfont) {
      color: #999 !important;
    }
  }
  .label {
    margin-left: 10px;
  }
  input {
    flex: 1;
    height: 100%;
    border: none;
    padding: 0 10px;
    background: transparent;
    &:focus {
      border: none;
      outline: none;
    }
  }
}
</style>
