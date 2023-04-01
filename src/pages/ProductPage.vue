<template>
  <main v-if="productsLoading" class="content container">
    <preloader-pic />
  </main>
  <main v-else-if="!productsData" class="content container">
    Не удалось загрузить товар
  </main>
  <main v-else class="content container">
    <div class="content__top">
      <base-breadcrumbs :crumbs="breadcrumbsData" />
    </div>

    <section class="item">
      <div class="item__pics pics">
        <div class="pics__wrapper">
          <img
            width="570"
            height="570"
            :src="product.imageSrc"
            :srcset="product.imageSrcset"
            :alt="product.title"
          />
        </div>
      </div>

      <div class="item__info">
        <span class="item__code">Артикул: {{ product.id }}</span>
        <h2 class="item__title" v-html="product.title"></h2>
        <div class="item__form">
          <form
            class="form"
            action="#"
            method="POST"
            @submit.prevent="addToCart()"
          >
            <b class="item__price"> {{ productPrice }} ₽ </b>

            <fieldset class="form__block">
              <legend class="form__legend">Цвет:</legend>
              <ul class="colors">
                <li v-for="el in product.color" :key="el" class="colors__item">
                  <label class="colors__label">
                    <input
                      class="colors__radio sr-only"
                      type="radio"
                      name="color-item"
                      value=""
                    />
                    <span
                      class="colors__value"
                      :style="{ 'background-color': el }"
                    >
                    </span>
                  </label>
                </li>
              </ul>
            </fieldset>

            <fieldset class="form__block">
              <legend class="form__legend">Объемб в ГБ:</legend>

              <ul class="sizes sizes--primery">
                <li class="sizes__item">
                  <label class="sizes__label">
                    <input
                      class="sizes__radio sr-only"
                      type="radio"
                      name="sizes-item"
                      value="32"
                    />
                    <span class="sizes__value"> 32gb </span>
                  </label>
                </li>
                <li class="sizes__item">
                  <label class="sizes__label">
                    <input
                      class="sizes__radio sr-only"
                      type="radio"
                      name="sizes-item"
                      value="64"
                    />
                    <span class="sizes__value"> 64gb </span>
                  </label>
                </li>
                <li class="sizes__item">
                  <label class="sizes__label">
                    <input
                      class="sizes__radio sr-only"
                      type="radio"
                      name="sizes-item"
                      value="128"
                      checked=""
                    />
                    <span class="sizes__value"> 128gb </span>
                  </label>
                </li>
              </ul>
            </fieldset>

            <div class="item__row">
              <custom-counter v-model="productAmount" />
              <button
                :disabled="productAddSending"
                class="button button--primery"
                type="submit"
              >
                В корзину
              </button>
            </div>
            <base-modal v-model:open="productAdded">
              Товар добавлен в корзину
            </base-modal>
            <div v-if="productAdded">Товар добавлен в корзину</div>
            <div v-if="productAddSending">Добавляем товар в корзину</div>
          </form>
        </div>
      </div>

      <div class="item__desc">
        <ul class="tabs">
          <li class="tabs__item">
            <a class="tabs__link tabs__link--current"> Описание </a>
          </li>
          <li class="tabs__item">
            <a class="tabs__link" href="#"> Характеристики </a>
          </li>
          <li class="tabs__item">
            <a class="tabs__link" href="#"> Гарантия </a>
          </li>
          <li class="tabs__item">
            <a class="tabs__link" href="#"> Оплата и доставка </a>
          </li>
        </ul>

        <div class="item__content">
          <p>
            Навигация GPS, ГЛОНАСС, BEIDOU Galileo и QZSS<br />
            Синхронизация со смартфоном<br />
            Связь по Bluetooth Smart, ANT+ и Wi-Fi<br />
            Поддержка сторонних приложений<br />
          </p>

          <a href="#"> Все характеристики </a>

          <h3>Что это?</h3>

          <p>
            Wahoo ELEMNT BOLT GPS – это велокомпьютер, который позволяет
            оптимизировать свои велотренировки, сделав их максимально
            эффективными. Wahoo ELEMNT BOLT GPS синхронизируется с датчиками по
            ANT+, объединяя полученную с них информацию. Данные отображаются на
            дисплее, а также сохраняются на смартфоне. При этом на мобильное
            устройство можно установить как фирменное приложение, так и
            различные приложения сторонних разработчиков. Велокомпьютер точно
            отслеживает местоположение, принимая сигнал с целого комплекса
            спутников. Эта информация позволяет смотреть уже преодоленные
            маршруты и планировать новые велопрогулки.
          </p>

          <h3>Дизайн</h3>

          <p>
            Велокомпьютер Wahoo ELEMNT BOLT очень компактный. Размеры устройства
            составляют всего 74,6 x 47,3 x 22,1 мм. что не превышает габариты
            смартфона. Корпус гаджета выполнен из черного пластика. На
            обращенной к пользователю стороне расположен дисплей диагональю 56
            мм. На дисплей выводятся координаты и скорость, а также полученная
            со смартфона и синхронизированных датчиков информация:
            интенсивность, скорость вращения педалей, пульс и т.д. (датчики не
            входят в комплект поставки). Корпус велокомпьютера имеет степень
            защиты от влаги IPX7. Это означает, что устройство не боится пыли, а
            также выдерживает кратковременное (до 30 минут) погружение в воду на
            глубину не более 1 метра.
          </p>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import axios from "axios";
import { API_BASE_URL } from "@/config";
import PreloaderPic from "@/components/PreloaderPic";
import CustomCounter from "@/components/CustomCounter";
import BaseBreadcrumbs from "@/components/BaseBreadcrumbs";
import BaseModal from "@/components/BaseModal";
import numberFormat from "@/helpers/numberFormat";
import { mapActions } from "vuex";

export default {
  name: "ProductPage",
  components: {
    CustomCounter,
    PreloaderPic,
    BaseBreadcrumbs,
    BaseModal,
  },
  data() {
    return {
      productAmount: 1,
      productsData: null,
      productsLoading: false,
      productsLoadingFailed: false,
      productAdded: false,
      productAddSending: false,
    };
  },
  computed: {
    productPrice() {
      return numberFormat(this.product.price);
    },
    product() {
      return Object.assign(this.productsData, {
        imageSrc: this.productsData.image.file.url,
      });
    },
    category() {
      return this.productsData.category;
    },

    breadcrumbsData() {
      return [
        { title: "Каталог", name: "main" },
        { title: this.category.title, name: "main" },
        { title: this.product.title, name: "" },
      ];
    },
  },
  methods: {
    ...mapActions(["addProductToCart"]),
    addToCart() {
      this.productAdded = false;
      this.productAddSending = true;

      this.addProductToCart({
        productId: this.product.id,
        quantity: this.productAmount,
      }).then(() => {
        this.productAdded = true;
        this.productAddSending = false;
      });
    },
    loadProduct() {
      this.productsLoading = true;
      this.productsLoadingFailed = false;
      axios
        .get(API_BASE_URL + "/api/products/" + this.$route.params.id)
        .then((response) => (this.productsData = response.data))
        .catch(() => (this.productsLoadingFailed = true))
        .then(() => (this.productsLoading = false));
    },
  },
  created() {
    this.loadProduct();
  },
  beforeRouteUpdate() {
    this.loadProduct();
  },
};
</script>
