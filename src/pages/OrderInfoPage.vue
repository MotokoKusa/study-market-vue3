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

      <h1 class="content__title">Заказ оформлен <span>№ 23621</span></h1>
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
import { mapGetters } from "vuex";

export default {
  name: "OrderInfoPage",
  components: {
    BaseCartBlock,
  },
  data() {
    return {
      costDelivery: 500,
    };
  },
  computed: {
    cartData() {
      return {
        products: this.products,
        costDelivery: this.costDelivery,
        totalAmount: this.totalAmount,
        totalPrice: this.totalPrice,
      };
    },
    infoBuyer() {
      return [
        { title: "Получатель", description: this.orderInfo?.name || "" },
        { title: "Адрес доставки", description: this.orderInfo?.address || "" },
        { title: "Телефон", description: this.orderInfo?.phone || "" },
        { title: "Email", description: this.orderInfo?.email || "" },
        { title: "Способ оплаты", description: "картой при получении" },
      ];
    },
    products() {
      return this.orderInfo?.basket.items || [];
    },
    totalAmount() {
      return this.products.reduce((amount, elem) => amount + elem.quantity, 0);
    },
    totalPrice() {
      return this.orderInfo?.totalPrice;
    },

    ...mapGetters(["orderInfo"]),
  },
  created() {
    if (this.orderInfo && this.orderInfo.id === this.$route.params.id) {
      return;
    }
    this.$store.dispatch("loadOrderInfo", this.$route.params.id);
  },
};
</script>
