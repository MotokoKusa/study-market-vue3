<template>
  <main v-if="cartLoading" class="content container"><preloader-pic /></main>
  <main v-else-if="cartLoadingFailed" class="content container">
    Не удалось загрузить корзину
  </main>
  <main v-else class="content container">
    <div class="content__top">
      <base-breadcrumbs :crumbs="breadcrumbsData" />

      <h1 class="content__title">Корзина</h1>
      <span class="content__info">{{ messageCartAmount }} </span>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <ul class="cart__list">
            <cart-item
              v-for="item in products"
              :key="item.productId"
              :item="item"
            />
          </ul>
        </div>

        <div class="cart__block">
          <p class="cart__desc">
            Мы&nbsp;посчитаем стоимость доставки на&nbsp;следующем этапе
          </p>
          <p class="cart__price">
            Итого: <span>{{ totalPriceFormat }} ₽</span>
          </p>
          <router-link v-slot="{ navigate }" :to="{ name: 'order' }" custom>
            <button
              class="cart__button button button--primery"
              type="button"
              :disabled="!totalPrice"
              @click="navigate"
            >
              Оформить заказ
            </button>
          </router-link>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import PreloaderPic from "@/components/PreloaderPic";
import wordFormat from "@/helpers/wordFormat";
import numberFormat from "@/helpers/numberFormat";
import { useStore } from "vuex";
import CartItem from "@/components/CartItem";
import BaseBreadcrumbs from "@/components/BaseBreadcrumbs";
import { computed, defineComponent } from "vue";

export default defineComponent({
  components: {
    CartItem,
    PreloaderPic,
    BaseBreadcrumbs,
  },
  setup() {
    const store = useStore();
    const totalPrice = computed(() => store.getters.cartTotalPrice);
    const totalPriceFormat = computed(() => {
      return numberFormat(totalPrice.value);
    });

    const breadcrumbsData = computed(() => {
      return [
        { title: "Каталог", name: "main" },
        { title: "Корзина", name: "" },
      ];
    });

    const products = computed(() => store.getters.cartDetailProducts);

    const totalAmount = computed(() => store.getters.cartTotalAmount);
    const messageCartAmount = computed(() => {
      let wordsCart = ["товар", "товара", "товаров"];
      return totalAmount.value + " " + wordFormat(totalAmount.value, wordsCart);
    });

    const cartLoading = computed(() => store.getters.isCartLoading);
    const cartLoadingFailed = computed(() => store.getters.isCartLoadingFailed);

    return {
      totalPriceFormat,
      messageCartAmount,
      breadcrumbsData,
      products,
      totalPrice,
      totalAmount,
      cartLoading,
      cartLoadingFailed,
      wordFormat,
    };
  },
});
</script>
