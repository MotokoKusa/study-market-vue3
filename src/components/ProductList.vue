<template>
  <ul v-if="list.length" class="catalog__list">
    <product-item :item="el" v-for="el in list" :key="el.id" />
  </ul>
</template>

<script>
import ProductItem from "@/components/ProductItem.vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    ProductItem,
  },
  props: {
    list: {
      type: Array,
    },
  },
});
</script>
