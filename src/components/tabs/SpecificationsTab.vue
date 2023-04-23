<template>
  <div class="item__content">
    <template v-if="product.specifications">
      <div v-for="(el, idx) in product.specifications" :key="idx">
        <h3>{{ el.title }}</h3>
        <p>{{ el.value }}</p>
      </div>
    </template>
    <div v-else>Информация отсутствует</div>
  </div>
</template>

<script>
export default {
  name: "SpecificationsTab",
  props: {
    product: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>
