<template>
  <div class="cart__block">
    <ul class="cart__orders">
      <li class="cart__order" v-for="item in products" :key="item.productId">
        <h3>{{ item.product.title }}</h3>
        <b>{{ totalPriceProduct(item) }} ₽</b>
        <span>Количество: {{ item.quantity }}</span>
        <span>Артикул: {{ item.product.id }}</span>
      </li>
    </ul>

    <div v-if="isCartTotal" class="cart__total">
      <p v-if="costDelivery">
        Доставка: <b>{{ costDelivery }} ₽</b>
      </p>
      <p>
        Итого: <b>{{ totalAmount }}</b> товара на сумму
        <b>{{ totalPrice }} ₽</b>
      </p>
    </div>

    <button
      v-if="isButton"
      class="cart__button button button--primery"
      type="submit"
      :disabled="disabled"
      @click="onClick"
    >
      Оформить заказ
    </button>
  </div>
</template>

<script>
import numberFormat from "@/helpers/numberFormat";
export default {
  name: "BaseCartBlock",
  props: {
    cartData: {
      type: Object,
      default: () => {},
    },
    isButton: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    costDelivery() {
      return this.cartData?.costDelivery || null;
    },
    totalAmount() {
      return this.cartData?.totalAmount || null;
    },
    totalPrice() {
      return this.cartData?.totalPrice || null;
    },
    isCartTotal() {
      return this.totalAmount && this.totalPrice;
    },
    products() {
      return this.cartData?.products || [];
    },
  },

  methods: {
    onClick() {
      this.$emit("click");
    },
    totalPriceProduct(item) {
      const total = item.product.price * item.quantity;
      return numberFormat(total);
    },
  },
};
</script>
