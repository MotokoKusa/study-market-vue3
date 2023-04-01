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
import { defineAsyncComponent } from "vue";

export default {
  name: "productItem",
  components: {
    BaseModal,
    ProductQuickView: defineAsyncComponent({
      loader: () => import("@/components/ProductQuickView"),
    }),
  },
  data() {
    return {
      color: null,
      currentProductId: null,
    };
  },
  props: {
    item: {
      type: Object,
    },
  },
  computed: {
    isQuickViewOpen: {
      get() {
        return !!this.currentProductId;
      },
      set(isOpen) {
        if (!isOpen) {
          this.currentProductId = null;
        }
      },
    },
    price() {
      return numberFormat(this.item.price);
    },
  },
  methods: {
    openVisionQuickView(productId) {
      this.currentProductId = productId;
    },
  },
};
</script>
