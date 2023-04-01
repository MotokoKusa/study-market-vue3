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
import formFieldMixin from "@/mixins/formFieldMixin";
export default {
  name: "BaseFormText",
  props: {
    type: {
      type: String,
      default: "text",
    },
  },
  mixins: [formFieldMixin],
};
</script>
