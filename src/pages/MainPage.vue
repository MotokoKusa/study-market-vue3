<template>
  <main class="content container">
    <div class="content__top content__top--catalog">
      <h1 class="content__title">Каталог</h1>
      <span class="content__info"> {{ messageTotalProducts }} </span>
    </div>

    <div class="content__catalog">
      <product-filter @get-products="loadProducts" />
      <section class="catalog">
        <preloader-pic v-if="productsLoading" />
        <div v-if="productsLoadingFailed">
          Произошла ошибка при загрузки товаров
          <button @click.prevent="loadProducts">попробовать еще раз</button>
        </div>
        <product-list v-if="!productsLoading" :list="productsPageList" />
        <base-pagination
          v-if="!productsLoading && productsPageList.length"
          v-model="page"
          :count="countProducts"
          v-model:per-page="productsPerPage"
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
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router/dist/vue-router";
import wordFormat from "@/helpers/wordFormat";

export default defineComponent({
  components: {
    ProductList,
    BasePagination,
    ProductFilter,
    PreloaderPic,
  },

  setup() {
    const route = useRoute();
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
    const loadProductsTimer = ref(null);
    const totalProducts = computed(() => productsData.value?.pagination?.total);
    const messageTotalProducts = computed(() => {
      const wordsCart = ["товар", "товара", "товаров"];
      if (!totalProducts.value) return null;
      return (
        totalProducts.value + " " + wordFormat(totalProducts.value, wordsCart)
      );
    });

    const loadProducts = (fields) => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      productsLoading.value = true;
      productsLoadingFailed.value = false;
      clearTimeout(loadProductsTimer.value);
      let productPropsPayload = {};

      if (fields?.productProps) {
        const propsOfProduct = fields?.productProps || [];
        productPropsPayload = propsOfProduct
          .map((el) => {
            return {
              ...el,
              availableValues: el?.availableValues.filter((el) => {
                return el.isChecked !== false;
              }),
            };
          })
          .filter((el) => el?.availableValues.length)
          .reduce((obj, elem) => {
            return {
              ...obj,
              [`props[${elem.code}]`]: elem.availableValues.map(
                (el) => el.value
              ),
            };
          }, {});
      }
      const payload = {
        page: page.value,
        limit: productsPerPage.value,
        categoryId: fields?.categoryId ?? route.query.categoryId,
        colorId: fields?.checkColor,
      };
      if (fields?.priceFrom) {
        payload.minPrice = fields?.priceFrom;
      }
      if (fields?.priceTo) {
        payload.maxPrice = fields?.priceTo;
      }

      loadProductsTimer.value = setTimeout(() => {
        axios
          .get(API_BASE_URL + `/api/products`, {
            params: {
              ...payload,
              ...productPropsPayload,
            },
          })
          .then((response) => (productsData.value = response.data))
          .catch(() => (productsLoadingFailed.value = true))
          .then(() => (productsLoading.value = false));
      }, 500);
    };

    watch(page, () => {
      loadProducts();
    });

    watch(productsPerPage, (val) => {
      clearTimeout(loadProductsTimer.value);
      if (val || val === 0) {
        loadProductsTimer.value = setTimeout(() => loadProducts(), 500);
      }
    });

    onMounted(() => {
      loadProducts();
    });
    return {
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
