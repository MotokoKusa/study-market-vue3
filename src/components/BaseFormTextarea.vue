<template>
  <base-form-field :title="title" :error="error">
    <textarea
      class="form__input form__input--area"
      v-model="dataValue"
      :placeholder="placeholder"
    ></textarea>
  </base-form-field>
</template>

<script>
import { computed, defineComponent } from "vue";
import BaseFormField from "@/components/BaseFormField";
export default defineComponent({
  name: "BaseFormTextarea",
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
