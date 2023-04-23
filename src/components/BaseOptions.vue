<template>
  <h3 v-if="title" class="cart__title">{{ title }}</h3>
  <ul v-if="isEmptyOptions" class="cart__options options">
    <li v-for="el in options" :key="el.id" class="options__item">
      <label class="options__label">
        <input
          class="options__radio sr-only"
          type="radio"
          :name="title"
          :value="el"
          v-model="selectedOption"
          :checked="selectedOption.id === el.id"
        />
        <span class="options__value">
          {{ el.title }}
          <b v-if="el.price">{{
            el.price !== "0" ? `${el.price} ₽` : "бесплатно"
          }}</b>
        </span>
      </label>
    </li>
  </ul>
</template>

<script>
import { computed, watch } from "vue";

export default {
  props: {
    title: {
      type: String,
      default: "",
    },
    optionsData: {
      type: Array,
      default: () => [],
    },
    modelValue: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, { emit }) {
    const isEmptyOptions = computed(() => {
      return props.optionsData.length;
    });
    const options = computed(() => {
      return props.optionsData || [];
    });

    const selectedOption = computed({
      get() {
        return props.modelValue;
      },
      set(value) {
        if (value !== null || undefined) {
          emit("update:modelValue", value);
        }
      },
    });

    watch(
      options,
      (val) => {
        selectedOption.value = val.at(0) || null;
      },
      {
        immediate: true,
      }
    );

    return {
      isEmptyOptions,
      selectedOption,
      options,
    };
  },
};
</script>
