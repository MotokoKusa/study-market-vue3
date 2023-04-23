<template>
  <div v-if="productStatus.isLoading">
    <preloader-pic />
  </div>
  <div v-else-if="productStatus.isFailed">Не удалось загрузить товар</div>
  <div v-else>
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
        <h2 class="item__title">
          {{ content.title }}
        </h2>
        <div class="item__form">
          <form
            class="form"
            action="#"
            method="POST"
            @submit.prevent="
              doAddToCart(content.id, productAmount, selectedColorValue)
            "
          >
            <b class="item__price"> {{ content.price }} ₽ </b>

            <fieldset class="form__block">
              <legend class="form__legend">Цвет:</legend>
              <ul class="colors">
                <li
                  v-for="(el, idx) in product.colors"
                  :key="idx"
                  class="colors__item"
                >
                  <label class="colors__label">
                    <input
                      class="colors__radio sr-only"
                      type="radio"
                      :name="`${product.slug} colors`"
                      :value="el.color.id"
                      v-model="selectedColorValue"
                    />
                    <span
                      class="colors__value"
                      :style="{ 'background-color': el.color.code }"
                    >
                    </span>
                  </label>
                </li>
              </ul>
            </fieldset>

            <fieldset v-if="offersPrice" class="form__block">
              <legend class="form__legend">{{ product.mainProp.title }}</legend>

              <ul class="sizes sizes--primery">
                <li
                  v-for="(el, idx) in offersPrice"
                  :key="idx"
                  class="sizes__item"
                >
                  <label class="sizes__label">
                    <input
                      class="sizes__radio sr-only"
                      :name="`${product.slug} offers`"
                      :value="el.value"
                      :checked="el.value === selectedOffersValue"
                      type="radio"
                      v-model="selectedOffersValue"
                    />
                    <span class="sizes__value"> {{ el.value }} </span>
                  </label>
                </li>
              </ul>
            </fieldset>

            <div class="item__row">
              <custom-counter v-model="productAmount" />
              <button
                :disabled="addingStatus.isSending"
                class="button button--primery"
                type="submit"
              >
                В корзину
              </button>
            </div>
            <base-modal v-model:open="addingStatus.isAdded">
              Товар добавлен в корзину
            </base-modal>
            <div v-if="addingStatus.isAdded">Товар добавлен в корзину</div>
            <div v-if="addingStatus.isSending">Добавляем товар в корзину</div>
          </form>
        </div>
      </div>

      <div class="item__desc">
        <BaseTabs :tabs="tabs" @select-tab="switchTabs" />
        <component :is="selectedTab" :product="product"></component>
      </div>
    </section>
  </div>
</template>

<script>
import PreloaderPic from "@/components/PreloaderPic";
import CustomCounter from "@/components/CustomCounter";
import BaseModal from "@/components/BaseModal";
import BaseTabs from "@/components/BaseTabs";
import DescriptionTab from "@/components/tabs/DescriptionTab";
import SpecificationsTab from "@/components/tabs/SpecificationsTab";
import { computed, defineComponent, onMounted, ref } from "vue";
import useProduct from "@/hooks/useProduct";

export default defineComponent({
  components: {
    CustomCounter,
    PreloaderPic,
    BaseModal,
    BaseTabs,
    DescriptionTab,
    SpecificationsTab,
  },
  props: {
    productId: { type: [Number, String], required: true },
    selectedOffer: { type: [Number, String] },
    selectedColor: { type: [Number, String] },
  },
  setup(props) {
    const {
      product,
      category,
      fetchProduct,
      fetchStatus: productStatus,
      addingStatus,
      addProduct: doAddToCart,
      offersPrice,
      selectedOffersValue,
      selectedColorValue,
      content,
      tabs,
      switchTabs,
      selectedTab,
    } = useProduct();

    const productAmount = ref(1);
    const breadcrumbsData = computed(() => {
      return [
        { title: "Каталог", name: "main" },
        { title: category.value.title, name: "main" },
        { title: product.value.title, name: "" },
      ];
    });

    fetchProduct(props.productId);
    onMounted(() => {
      selectedOffersValue.value = props.selectedOffer;
      selectedColorValue.value = props.selectedColor;
    });

    return {
      productAmount,
      productsData: product,
      productStatus,
      product,
      category,
      breadcrumbsData,
      addingStatus,
      doAddToCart,
      content,
      offersPrice,
      selectedOffersValue,
      selectedColorValue,
      tabs,
      switchTabs,
      selectedTab,
    };
  },
});
</script>
