<template>
  <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link" href="index.html"> Каталог </a>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link" href="cart.html"> Корзина </a>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link"> Оформление заказа </a>
        </li>
      </ul>

      <h1 class="content__title">
        Заказ оформлен <span>№ {{ orderInfo?.basket?.id }}</span>
      </h1>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <p class="cart__message">
            Благодарим за&nbsp;выбор нашего магазина. На&nbsp;Вашу почту придет
            письмо с&nbsp;деталями заказа. Наши менеджеры свяжутся с&nbsp;Вами
            в&nbsp;течение часа для уточнения деталей доставки.
          </p>

          <ul class="dictionary">
            <li
              class="dictionary__item"
              v-for="(el, idx) in infoBuyer"
              :key="idx"
            >
              <span class="dictionary__key"> {{ el.title }} </span>
              <span class="dictionary__value"> {{ el.description }} </span>
            </li>
          </ul>
        </div>

        <base-cart-block :cart-data="cartData" />
      </form>
    </section>
  </main>
</template>

<script>
import BaseCartBlock from "@/components/BaseCartBlock";
import { useStore } from "vuex";
import { computed, defineComponent, ref } from "vue";
import { useRoute } from "vue-router/dist/vue-router";

export default defineComponent({
  components: {
    BaseCartBlock,
  },
  setup() {
    const costDelivery = ref(500);
    const store = useStore();
    const route = useRoute();
    const orderInfo = computed(() => store.getters.orderInfo);
    const products = computed(() => {
      return orderInfo.value?.basket.items || [];
    });
    const totalAmount = computed(() => {
      return products.value.reduce((amount, elem) => amount + elem.quantity, 0);
    });

    const totalPrice = computed(() => {
      return orderInfo.value?.totalPrice;
    });

    const cartData = computed(() => {
      return {
        products: products.value,
        costDelivery: costDelivery.value,
        totalAmount: totalAmount.value,
        totalPrice: totalPrice.value,
      };
    });
    const infoBuyer = computed(() => {
      return [
        { title: "Получатель", description: orderInfo.value?.name || "" },
        {
          title: "Адрес доставки",
          description: orderInfo.value?.address || "",
        },
        { title: "Телефон", description: orderInfo.value?.phone || "" },
        { title: "Email", description: orderInfo.value?.email || "" },
        { title: "Способ оплаты", description: "картой при получении" },
      ];
    });

    if (!orderInfo.value && orderInfo.value?.id !== +route.params.id) {
      store.dispatch("loadOrderInfo", route.params.id);
    }

    return {
      infoBuyer,
      cartData,
      orderInfo,
    };
  },
});
</script>
