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
    <div class="product__code">
      <span v-if="item.color" class="product__code__color">
        Цвет:
        <span
          class="colors__value"
          :style="{ 'background-color': item.color.code }"
        ></span>
        {{ item.color.title }}
      </span>

      <span v-if="item.prop && typesProps.color.code !== item.prop.code">
        {{ item.prop.title }}: {{ item.prop.value }}
      </span>
      <span> Артикул: {{ item.cartProductId }} </span>
    </div>

    <custom-counter v-model="quantity" />

    <b class="product__price"> {{ totalPriceProduct }} ₽ </b>

    <button
      @click.prevent="deleteProduct(item.cartProductId)"
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
import typesProps from "@/helpers/typesProps";
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
          basketItemId: props.item.cartProductId,
          quantity: value,
        });
      },
    });

    watch(quantity, (val) => {
      if (!val) {
        store.dispatch("deleteProductToCart", props.item.cartProductId);
      }
    });

    const deleteProduct = (val) => store.dispatch("deleteProductToCart", val);
    return {
      totalPriceProduct,
      quantity,
      deleteProduct,
      typesProps,
    };
  },
});
</script>
