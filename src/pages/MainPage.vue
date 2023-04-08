<template>
  <main class="content container">
    <div class="content__top content__top--catalog">
      <h1 class="content__title">Каталог</h1>
      <span class="content__info"> {{ messageTotalProducts }} </span>
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
import wordFormat from "@/helpers/wordFormat";

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
              imageSrc: product?.preview?.file?.url,
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
    const productsPerPage = ref(12);
    const priceFrom = ref(0);
    const priceTo = ref(0);
    const categoryId = ref(0);
    const colorCheck = ref(null);
    const loadProductsTimer = ref(null);
    const totalProducts = computed(() => productsData.value?.pagination?.total);
    const messageTotalProducts = computed(() => {
      let wordsCart = ["товар", "товара", "товаров"];
      if (!totalProducts.value) return null;
      return (
        totalProducts.value + " " + wordFormat(totalProducts.value, wordsCart)
      );
    });

    const loadProducts = () => {
      productsLoading.value = true;
      productsLoadingFailed.value = false;
      clearTimeout(loadProductsTimer.value);

      const payload = {
        page: page.value,
        limit: productsPerPage.value,
        categoryId: categoryId.value,
        colorId: colorCheck.value,
      };
      if (priceFrom.value) {
        payload.minPrice = priceFrom.value;
      }
      if (priceTo.value) {
        payload.maxPrice = priceTo.value;
      }
      loadProductsTimer.value = setTimeout(() => {
        axios
          .get(API_BASE_URL + `/api/products`, {
            params: {
              ...payload,
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
      messageTotalProducts,
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
