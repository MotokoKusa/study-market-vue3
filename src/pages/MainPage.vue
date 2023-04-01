<template>
  <main class="content container">
    <div class="content__top content__top--catalog">
      <h1 class="content__title">Каталог</h1>
      <span class="content__info"> 152 товара </span>
    </div>

    <div class="content__catalog">
      <product-filter
        v-model:price-from="priceFrom"
        v-model:price-to="priceTo"
        v-model:category-id="categoryId"
        v-model:check-color="colorCheck"
      />
      <section class="catalog">
        <preloader-pic v-if="productsLoading" />
        <div v-if="productsLoadingFailed">
          Произошла ошибка при загрузки товаров
          <button @click.prevent="loadProducts">попробовать еще раз</button>
        </div>
        <product-list v-if="!productsLoading" :list="productsPageList" />
        <base-pagination
          v-if="!productsLoading"
          v-model="page"
          :count="countProducts"
          :per-page="productsPerPage"
        />
      </section>
    </div>
  </main>
</template>

<script>
import PreloaderPic from "@/components/PreloaderPic";
import { API_BASE_URL } from "@/config";
import axios from "axios";
import ProductList from "@/components/ProductList.vue";
import BasePagination from "@/components/BasePagination";
import ProductFilter from "@/components/ProductFilter";

export default {
  name: "MainPage",
  components: {
    ProductList,
    BasePagination,
    ProductFilter,
    PreloaderPic,
  },
  data() {
    return {
      page: 1,
      productsPerPage: 3,
      priceFrom: 0,
      priceTo: 0,
      categoryId: 0,
      colorCheck: null,
      productsData: null,
      productsLoading: true,
      productsLoadingFailed: false,
    };
  },
  computed: {
    productsPageList() {
      return this.productsData
        ? this.productsData.items.map((product) => {
            return {
              ...product,
              imageSrc: product.image.file.url,
            };
          })
        : [];
    },
    countProducts() {
      return this.productsData ? this.productsData.pagination.total : [];
    },
  },
  methods: {
    loadProducts() {
      this.productsLoading = true;
      this.productsLoadingFailed = false;
      clearTimeout(this.loadProductsTimer);
      this.loadProductsTimer = setTimeout(() => {
        axios
          .get(API_BASE_URL + `/api/products`, {
            params: {
              page: this.page,
              limit: this.productsPerPage,
              categoryId: this.categoryId,
              minPrice: this.priceFrom,
              maxPrice: this.priceTo,
              colorId: this.colorCheck,
            },
          })
          .then((response) => (this.productsData = response.data))
          .catch(() => (this.productsLoadingFailed = true))
          .then(() => (this.productsLoading = false));
      }, 500);
    },
  },
  watch: {
    page() {
      this.loadProducts();
    },
    categoryId() {
      this.loadProducts();
    },
    priceFrom() {
      this.loadProducts();
    },
    priceTo() {
      this.loadProducts();
    },
    colorCheck() {
      this.loadProducts();
    },
  },
  created() {
    this.loadProducts();
  },
};
</script>
