<template>
  <main class="content container">
    <div class="content__top">
      <base-breadcrumbs :crumbs="breadcrumbsData" />

      <h1 class="content__title">
        Заказ оформлен <span>№ {{ orderInfo.id }}</span>
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
import BaseBreadcrumbs from "@/components/BaseBreadcrumbs";
import { useStore } from "vuex";
import { computed, defineComponent } from "vue";
import { useRoute } from "vue-router/dist/vue-router";

export default defineComponent({
  components: {
    BaseCartBlock,
    BaseBreadcrumbs,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const orderInfo = computed(() => store.getters.orderInfo);
    const products = computed(() => {
      return (
        orderInfo.value?.basket.items.map((el) => {
          return {
            ...el,
            product: {
              ...el.productOffer,
            },
          };
        }) || []
      );
    });
    const totalAmount = computed(() => {
      return products.value.reduce((amount, elem) => amount + elem.quantity, 0);
    });

    const totalPrice = computed(() => {
      return orderInfo.value?.totalPrice;
    });

    const breadcrumbsData = computed(() => {
      return [
        { title: "Каталог", name: "main" },
        { title: "Корзина", name: "cart" },
        { title: "Оформление заказа", name: "" },
      ];
    });

    const cartData = computed(() => {
      return {
        products: products.value,
        costDelivery: orderInfo.value?.deliveryType,
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
        {
          title: "Способ оплаты",
          description: orderInfo.value?.paymentType || "",
        },
      ];
    });

    if (!orderInfo.value && orderInfo.value?.id !== +route.params.id) {
      store.dispatch("loadOrderInfo", route.params.id);
    }

    return {
      infoBuyer,
      cartData,
      orderInfo,
      breadcrumbsData,
    };
  },
});
</script>
