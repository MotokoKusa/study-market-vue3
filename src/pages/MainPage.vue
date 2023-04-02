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
import { computed, defineComponent, ref, watch } from "vue";

export default defineComponent({
  components: {
    ProductList,
    BasePagination,
    ProductFilter,
    PreloaderPic,
  },

  setup() {
    const productsData = ref(null);

    const productsPageList = computed(() => {
      return productsData.value
        ? productsData.value.items.map((product) => {
            return {
              ...product,
              imageSrc: product.image.file.url,
            };
          })
        : [];
    });
    const countProducts = computed(() => {
      return productsData.value ? productsData.value.pagination.total : [];
    });

    const productsLoading = ref(true);
    const productsLoadingFailed = ref(false);
    const page = ref(1);
    const productsPerPage = ref(3);
    const priceFrom = ref(0);
    const priceTo = ref(0);
    const categoryId = ref(0);
    const colorCheck = ref(null);
    const loadProductsTimer = ref(null);

    const loadProducts = () => {
      productsLoading.value = true;
      productsLoadingFailed.value = false;
      clearTimeout(loadProductsTimer.value);
      loadProductsTimer.value = setTimeout(() => {
        axios
          .get(API_BASE_URL + `/api/products`, {
            params: {
              page: page.value,
              limit: productsPerPage.value,
              categoryId: categoryId.value,
              minPrice: priceFrom.value,
              maxPrice: priceTo.value,
              colorId: colorCheck.value,
            },
          })
          .then((response) => (productsData.value = response.data))
          .catch(() => (productsLoadingFailed.value = true))
          .then(() => (productsLoading.value = false));
      }, 500);
    };

    watch(
      [page, categoryId, priceFrom, priceTo, colorCheck],
      () => {
        loadProducts();
      },
      {
        immediate: true,
      }
    );
    return {
      priceFrom,
      priceTo,
      categoryId,
      colorCheck,
      productsLoadingFailed,
      loadProducts,
      productsPageList,
      page,
      countProducts,
      productsPerPage,
      productsLoading,
    };
  },
});
</script>
