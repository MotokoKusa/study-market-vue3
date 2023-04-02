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
      type="button"
      :disabled="disabled"
      @click.prevent="onClick"
    >
      Оформить заказ
    </button>
  </div>
</template>

<script>
import numberFormat from "@/helpers/numberFormat";
import { computed, defineComponent } from "vue";

export default defineComponent({
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

  setup(props, { emit }) {
    const costDelivery = computed(() => props.cartData?.costDelivery || null);
    const totalAmount = computed(() => props.cartData?.totalAmount || null);
    const totalPrice = computed(() => props.cartData?.totalPrice || null);
    const isCartTotal = computed(() => totalAmount.value && totalPrice.value);
    const products = computed(() => props.cartData?.products || []);

    const onClick = () => emit("onClick");
    const totalPriceProduct = (item) => {
      const total = item.product.price * item.quantity;
      return numberFormat(total);
    };

    return {
      costDelivery,
      totalAmount,
      totalPrice,
      isCartTotal,
      products,
      onClick,
      totalPriceProduct,
    };
  },
});
</script>
