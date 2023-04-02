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
      @click.prevent="deleteProduct(item.productId)"
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
import { useStore } from "vuex";
import numberFormat from "@/helpers/numberFormat";
import CustomCounter from "@/components/CustomCounter";
import { computed, defineComponent, watch } from "vue";

export default defineComponent({
  components: {
    CustomCounter,
  },
  props: ["item"],
  setup(props) {
    const store = useStore();
    const totalPriceProduct = computed(() => {
      return numberFormat(props.item.product.price * props.item.quantity);
    });
    const quantity = computed({
      get() {
        return props.item.quantity;
      },
      set(value) {
        store.dispatch("updateCartProductAmount", {
          productId: props.item.productId,
          quantity: value,
        });
      },
    });

    watch(quantity, (val) => {
      if (!val) {
        store.dispatch("deleteProductToCart", props.item.productId);
      }
    });

    const deleteProduct = (val) => store.dispatch("deleteProductToCart", val);
    return {
      totalPriceProduct,
      quantity,
      deleteProduct,
    };
  },
});
</script>
