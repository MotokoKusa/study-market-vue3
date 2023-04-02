<template>
  <base-form-field :title="title" :error="error">
    <input
      class="form__input"
      :type="type"
      :placeholder="placeholder"
      v-model="dataValue"
    />
  </base-form-field>
</template>

<script>
import { computed, defineComponent } from "vue";
import BaseFormField from "@/components/BaseFormField";
export default defineComponent({
  name: "BaseFormText",
  props: {
    title: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    error: {
      type: String,
      default: "",
    },
    modelValue: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "text",
    },
  },
  components: {
    BaseFormField,
  },
  setup(props, { emit }) {
    const dataValue = computed({
      get() {
        return props.modelValue;
      },
      set(value) {
        emit("update:modelValue", value);
      },
    });

    return {
      dataValue,
    };
  },
});
</script>
