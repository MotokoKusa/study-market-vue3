<template>
  <li class="cart__item product">
    <div class="product__pic">
      <img
        :src="item.product.imageSrc"
        width="120"
        height="120"
        :srcset="item.product.imageSrcset"
        :alt="item.product.title"
      />
    </div>
    <h3 class="product__title">{{ item.product.title }}</h3>
    <span class="product__code"> Артикул: {{ item.productId }} </span>

    <custom-counter v-model="quantity" />

    <b class="product__price"> {{ totalPriceProduct }} ₽ </b>

    <button
      @click.prevent="deleteProductToCart(item.productId)"
      class="product__del button-del"
      type="button"
      aria-label="Удалить товар из корзины"
    >
      <svg width="20" height="20" fill="currentColor">
        <use xlink:href="#icon-close"></use>
      </svg>
    </button>
  </li>
</template>

<script>
import { mapActions } from "vuex";
import numberFormat from "@/helpers/numberFormat";
import CustomCounter from "@/components/CustomCounter";

export default {
  name: "CartItem",
  components: {
    CustomCounter,
  },
  props: ["item"],
  computed: {
    totalPriceProduct() {
      return numberFormat(this.item.product.price * this.item.quantity);
    },
    quantity: {
      get() {
        return this.item.quantity;
      },
      set(value) {
        this.$store.dispatch("updateCartProductAmount", {
          productId: this.item.productId,
          quantity: value,
        });
      },
    },
  },
  watch: {
    quantity(val) {
      if (!val) {
        this.deleteProductToCart(this.item.productId);
      }
    },
  },
  methods: {
    ...mapActions(["deleteProductToCart"]),
  },
};
</script>
