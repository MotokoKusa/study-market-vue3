<template>
  <main class="content container">
    <div class="content__top">
      <base-breadcrumbs :crumbs="breadcrumbsData" />

      <h1 class="content__title">Корзина</h1>
      <span class="content__info"> 3 товара </span>
    </div>
    <section class="cart">
      <form
        class="cart__form form"
        action="#"
        method="POST"
        :disabled="isSending"
        @submit.prevent="order"
      >
        <div class="cart__field" v-if="!isSending">
          <div class="cart__data">
            <base-form-text
              title="ФИО"
              placeholder="Введите ваше полное имя"
              :error="formError.name"
              v-model="formData.name"
            />
            <base-form-text
              title="Адрес доставки"
              v-model="formData.address"
              :error="formError.address"
              placeholder="Введите ваш адрес"
            />
            <base-form-text
              title="Телефон"
              type="tel"
              v-model="formData.phone"
              :error="formError.phone"
              placeholder="Введите ваш телефон"
            />
            <base-form-text
              title="Email"
              type="email"
              v-model="formData.email"
              :error="formError.email"
              placeholder="Введи ваш Email"
            />

            <base-form-textarea
              title="Комментарий к заказу"
              v-model="formData.comment"
              placeholder="Ваши пожелания"
              :error="formError.comment"
            />
          </div>

          <div class="cart__options">
            <h3 class="cart__title">Доставка</h3>
            <ul class="cart__options options">
              <li class="options__item">
                <label class="options__label">
                  <input
                    class="options__radio sr-only"
                    type="radio"
                    name="delivery"
                    value="0"
                    checked=""
                  />
                  <span class="options__value">
                    Самовывоз <b>бесплатно</b>
                  </span>
                </label>
              </li>
              <li class="options__item">
                <label class="options__label">
                  <input
                    class="options__radio sr-only"
                    type="radio"
                    name="delivery"
                    value="500"
                  />
                  <span class="options__value"> Курьером <b>500 ₽</b> </span>
                </label>
              </li>
            </ul>

            <h3 class="cart__title">Оплата</h3>
            <ul class="cart__options options">
              <li class="options__item">
                <label class="options__label">
                  <input
                    class="options__radio sr-only"
                    type="radio"
                    name="pay"
                    value="card"
                  />
                  <span class="options__value"> Картой при получении </span>
                </label>
              </li>
              <li class="options__item">
                <label class="options__label">
                  <input
                    class="options__radio sr-only"
                    type="radio"
                    name="pay"
                    value="cash"
                  />
                  <span class="options__value"> Наличными при получении </span>
                </label>
              </li>
            </ul>
          </div>
        </div>
        <div v-else class="cart__field">
          <preloader-pic />
        </div>
        <base-cart-block
          :cart-data="cartData"
          :is-button="true"
          :disabled="isSending"
          @click="order"
        />
        <div class="cart__error form__error-block" v-if="formErrorMessage">
          <h4>Заявка не отправлена!</h4>
          <p>{{ formErrorMessage }}</p>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import BaseFormText from "@/components/BaseFormText";
import BaseFormTextarea from "@/components/BaseFormTextarea";
import PreloaderPic from "@/components/PreloaderPic";
import BaseCartBlock from "@/components/BaseCartBlock";
import BaseBreadcrumbs from "@/components/BaseBreadcrumbs";
import { mapGetters } from "vuex";
import axios from "axios";
import { API_BASE_URL } from "@/config";

export default {
  name: "OrderPage",
  components: {
    BaseBreadcrumbs,
    BaseFormText,
    BaseFormTextarea,
    PreloaderPic,
    BaseCartBlock,
  },
  data() {
    return {
      formData: {},
      formError: {},
      formErrorMessage: "",
      costDelivery: 500,
      isSending: false,
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
    breadcrumbsData() {
      return [
        { title: "Каталог", name: "main" },
        { title: "Корзина", name: "cart" },
        { title: "Оформление заказа", name: "" },
      ];
    },
    ...mapGetters({
      products: "cartDetailProducts",
      totalAmount: "cartTotalAmount",
      totalPrice: "cartTotalPrice",
    }),
  },
  methods: {
    order() {
      this.isSending = true;
      this.formError = {};
      axios
        .post(
          API_BASE_URL + "/api/orders",
          {
            ...this.formData,
          },
          {
            params: {
              userAccessKey: this.$store.state.userAccessKey,
            },
          }
        )
        .then((response) => {
          setTimeout(() => (this.isSending = false), 1000);
          this.$store.commit("resetCart");
          this.$store.commit("updateOrderInfo", response.data);
          this.$router.push({
            name: "orderInfo",
            params: { id: response.data.id },
          });
        })
        .catch((error) => {
          setTimeout(() => (this.isSending = false), 1000);
          this.formError = error.response.data.error.request || {};
          this.formErrorMessage = error.response.data.error.message || "";
        });
    },
  },
};
</script>
