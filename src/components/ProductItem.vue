<template>
  <li class="catalog__item">
    <router-link
      :to="{ name: 'product', params: { id: item.id } }"
      class="catalog__pic"
    >
      <img :src="item.imageSrc" :srcset="item.imageSrcset" :alt="item.title" />
    </router-link>
    <h3 class="catalog__title" @click.prevent="openVisionQuickView(item.id)">
      <a href="#">{{ item.title }}</a>
    </h3>
    <span class="catalog__price">{{ price }} ₽</span>
    <ul class="colors colors--black">
      <li v-for="el in item.colors" :key="el.id" class="colors__item">
        <label class="colors__label">
          <input
            class="colors__radio sr-only"
            type="radio"
            :value="el.code"
            v-model="color"
          />
          <span
            class="colors__value"
            :style="{ 'background-color': el.code }"
          ></span>
        </label>
      </li>
    </ul>
  </li>
  <base-modal v-model:open="isQuickViewOpen">
    <product-quick-view :product-id="currentProductId" />
  </base-modal>
</template>

<script>
import numberFormat from "@/helpers/numberFormat";
import BaseModal from "@/components/BaseModal";
import { computed, defineAsyncComponent, defineComponent, ref } from "vue";

export default defineComponent({
  components: {
    BaseModal,
    ProductQuickView: defineAsyncComponent({
      loader: () => import("@/components/ProductQuickView"),
    }),
  },
  props: {
    item: {
      type: Object,
    },
  },
  setup(props) {
    const color = ref(null);
    const currentProductId = ref(null);

    const isQuickViewOpen = computed({
      get() {
        return !!currentProductId.value;
      },
      set(isOpen) {
        if (!isOpen) {
          currentProductId.value = null;
        }
      },
    });
    const price = computed(() => {
      return numberFormat(props.item.price);
    });

    const openVisionQuickView = (productId) => {
      currentProductId.value = productId;
    };

    return {
      color,
      isQuickViewOpen,
      price,
      openVisionQuickView,
      currentProductId,
    };
  },
});
</script>
