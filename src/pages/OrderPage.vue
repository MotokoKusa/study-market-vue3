<template>
  <main class="content container">
    <div class="content__top">
      <base-breadcrumbs :crumbs="breadcrumbsData" />

      <h1 class="content__title">Корзина</h1>
      <span class="content__info"> 3 товара </span>
    </div>
    <section class="cart">
      <form class="cart__form form">
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
            <base-options
              title="Доставка"
              :options-data="deliveryData"
              v-model="formData.delivery"
            />
            <base-options
              title="Оплата"
              :options-data="paymentsData"
              v-model="formData.payment"
            />
          </div>
        </div>
        <div v-else class="cart__field">
          <preloader-pic />
        </div>
        <base-cart-block
          :cart-data="cartData"
          :is-button="true"
          :disabled="isSending"
          @on-click="sendOrder"
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
import BaseOptions from "@/components/BaseOptions";
import { useStore } from "vuex";
import axios from "axios";
import { API_BASE_URL } from "@/config";
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  watchEffect,
} from "vue";
import router from "@/router";
import numberFormat from "@/helpers/numberFormat";

export default defineComponent({
  components: {
    BaseBreadcrumbs,
    BaseFormText,
    BaseFormTextarea,
    PreloaderPic,
    BaseCartBlock,
    BaseOptions,
  },

  setup() {
    const store = useStore();
    const formData = reactive({});
    const costDelivery = ref(500);

    const products = computed(() => store.getters.cartDetailProducts);
    const totalAmount = computed(() => store.getters.cartTotalAmount);
    const totalPrice = computed(() => store.getters.cartTotalPrice);

    const cartData = computed(() => {
      return {
        products: products.value,
        costDelivery: costDelivery.value,
        totalAmount: totalAmount.value,
        totalPrice: totalPrice.value,
      };
    });
    const breadcrumbsData = computed(() => {
      return [
        { title: "Каталог", name: "main" },
        { title: "Корзина", name: "cart" },
        { title: "Оформление заказа", name: "" },
      ];
    });

    const formError = ref({});
    const formErrorMessage = ref("");
    const isSending = ref(false);

    const sendOrder = () => {
      isSending.value = true;
      formError.value = {};
      axios
        .post(
          API_BASE_URL + "/api/orders",
          {
            ...formData,
            deliveryTypeId: formData.delivery?.id,
            paymentTypeId: formData.payment?.id,
          },
          {
            params: {
              userAccessKey: store.state.userAccessKey,
            },
          }
        )
        .then((response) => {
          setTimeout(() => (isSending.value = false), 1000);
          store.commit("resetCart");
          store.commit("updateOrderInfo", response.data);
          router.replace({
            name: "orderInfo",
            params: { id: response.data.id },
          });
        })
        .catch((error) => {
          setTimeout(() => (isSending.value = false), 1000);
          formError.value = error.response.data.error.request || {};
          formErrorMessage.value = error.response.data.error.message || "";
        });
    };

    const deliveryData = ref([]);

    const getDelivery = () => {
      try {
        axios
          .get(API_BASE_URL + "/api/deliveries")
          .then((response) => {
            deliveryData.value = response.data.map((el) => {
              return {
                ...el,
                price: numberFormat(el.price),
              };
            });
          })
          .then(() => {
            getPayments(formData.delivery?.id);
          });
      } catch (e) {
        console.log(e);
      }
    };
    const paymentsData = ref([]);

    const getPayments = (deliveryTypeId) => {
      try {
        axios
          .get(API_BASE_URL + "/api/payments", {
            params: {
              deliveryTypeId: deliveryTypeId,
            },
          })
          .then((response) => {
            paymentsData.value = response.data;
          });
      } catch (e) {
        console.error(e);
      }
    };

    watchEffect(() => {
      if (formData.delivery?.id) {
        costDelivery.value = formData.delivery;
        getPayments(formData.delivery.id);
      }
    });

    onMounted(() => {
      getDelivery();
    });
    return {
      cartData,
      breadcrumbsData,
      sendOrder,
      formData,
      isSending,
      formError,
      formErrorMessage,
      deliveryData,
      paymentsData,
    };
  },
});
</script>
