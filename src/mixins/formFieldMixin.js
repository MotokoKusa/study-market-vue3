import BaseFormField from "@/components/BaseFormField";

export default {
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
  computed: {
    dataValue: {
      get() {
        return this.modelValue;
      },
      set(modelValue) {
        this.$emit("update:modelValue", modelValue);
      },
    },
  },
};
