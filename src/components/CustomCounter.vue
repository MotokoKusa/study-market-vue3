<template>
  <div class="product__counter form__counter">
    <button
      @click.prevent="updateValue(valueCounter - 1)"
      type="button"
      aria-label="Убрать один товар"
    >
      <svg width="10" height="10" fill="currentColor">
        <use xlink:href="#icon-minus"></use>
      </svg>
    </button>

    <input
      min="0"
      max="200"
      step="1"
      type="number"
      :value="valueCounter"
      @input="updateValue($event.target.value)"
      name="count"
    />

    <button
      @click.prevent="updateValue(valueCounter + 1)"
      type="button"
      aria-label="Добавить один товар"
    >
      <svg width="10" height="10" fill="currentColor">
        <use xlink:href="#icon-plus"></use>
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  name: "CustomCounter",
  props: ["modelValue"],
  computed: {
    valueCounter() {
      return this.modelValue || 1;
    },
  },
  methods: {
    updateValue(val) {
      this.$emit("update:modelValue", +val > 0 ? +val : 0);
    },
  },
  mounted() {
    console.log(this.valueCounter);
  },
};
</script>
