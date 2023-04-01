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
import formFieldMixin from "@/mixins/formFieldMixin";
export default {
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
    value: {
      type: String,
      default: "",
    },
  },
  mixins: [formFieldMixin],
};
</script>
