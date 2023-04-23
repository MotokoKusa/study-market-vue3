<template>
  <div class="item__content">
    <div v-if="product.content" v-html="product.content"></div>
    <div v-else>Информация отсутствует</div>
  </div>
</template>

<script>
export default {
  name: "DescriptionTab",
  props: {
    product: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>
