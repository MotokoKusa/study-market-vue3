<template>
  <aside class="filter">
    <h2 class="filter__title">Фильтры</h2>

    <form
      class="filter__form form"
      action="#"
      method="get"
      @submit.prevent="submit"
    >
      <fieldset class="form__block">
        <legend class="form__legend">Цена</legend>
        <label class="form__label form__label--price">
          <input
            class="form__input"
            type="text"
            name="min-price"
            v-model.number="currentPriceFrom"
          />
          <span class="form__value">От</span>
        </label>
        <label class="form__label form__label--price">
          <input
            class="form__input"
            type="text"
            name="max-price"
            v-model.number="currentPriceTo"
          />
          <span class="form__value">До</span>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Категория</legend>
        <label class="form__label form__label--select">
          <select
            class="form__select"
            name="category"
            v-model.number="currentCategoryId"
          >
            <option value="0">Все категории</option>
            <option v-for="el in categories" :key="el.id" :value="el.id">
              {{ el.title }}
            </option>
          </select>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Цвет</legend>
        <ul class="colors">
          <li v-for="el in colors" :key="el.id" class="colors__item">
            <label class="colors__label">
              <input
                v-model="currentCheckColor"
                class="colors__radio sr-only"
                type="radio"
                name="color"
                :value="el.id"
              />
              <span
                class="colors__value"
                :style="{ 'background-color': el.code }"
              >
              </span>
            </label>
          </li>
        </ul>
      </fieldset>

      <fieldset
        class="form__block"
        v-for="el in productPropsData?.productProps"
        :key="el.id"
      >
        <legend class="form__legend">{{ el.title }}</legend>
        <ul class="check-list">
          <li
            class="check-list__item"
            v-for="(item, idx) in el.availableValues"
            :key="idx"
          >
            <label class="check-list__label">
              <input
                class="check-list__check sr-only"
                type="checkbox"
                name="volume"
                v-model="item.isChecked"
                :checked="item.isChecked"
              />
              <span class="check-list__desc">
                {{ item.value }}
                <span>{{ item.productsCount }}</span>
              </span>
            </label>
          </li>
        </ul>
      </fieldset>
      <button class="filter__submit button button--primery" type="submit">
        Применить
      </button>
      <button
        class="filter__reset button button--second"
        type="button"
        @click="reset"
      >
        Сбросить
      </button>
    </form>
  </aside>
</template>

<script>
import { API_BASE_URL } from "@/config";
import axios from "axios";
import { computed, defineComponent, ref, toRefs, watch } from "vue";

export default defineComponent({
  props: ["priceFrom", "priceTo", "categoryId", "checkColor", "productProps"],

  setup(props, { emit }) {
    const categoriesData = ref({});
    const categories = computed(() => {
      return categoriesData.value ? categoriesData.value.items : [];
    });

    const colorsData = ref({});
    const colors = computed(() => {
      return colorsData.value ? colorsData.value.items : [];
    });

    const currentPriceFrom = ref(0);
    const currentPriceTo = ref(0);
    const currentCategoryId = ref(0);
    const currentCheckColor = ref(null);
    const productPropsData = ref({});

    const submit = () => {
      const productPropsClone = JSON.parse(
        JSON.stringify(productPropsData.value)
      );
      emit("update:priceFrom", currentPriceFrom.value);
      emit("update:priceTo", currentPriceTo.value);
      emit("update:categoryId", currentCategoryId.value);
      emit("update:checkColor", currentCheckColor.value);
      emit("update:productProps", productPropsClone);
    };
    const reset = () => {
      emit("update:priceFrom", 0);
      emit("update:priceTo", 0);
      emit("update:categoryId", 0);
      emit("update:checkColor", null);
      emit("update:productProps", []);
    };

    const loadProductCategories = () => {
      try {
        axios.get(API_BASE_URL + "/api/productCategories").then((response) => {
          categoriesData.value = response.data;
        });
      } catch (e) {
        console.error(e);
        categoriesData.value = {};
      }
    };

    const loadColors = () => {
      try {
        axios.get(API_BASE_URL + "/api/colors").then((response) => {
          colorsData.value = response.data;
        });
      } catch (e) {
        console.error(e);
        colorsData.value = {};
      }
    };

    const loadCategories = async () => {
      await loadProductCategories();
      await loadColors();
    };

    const loadProductProps = (categoryId) => {
      try {
        axios
          .get(API_BASE_URL + "/api/productCategories/" + categoryId)
          .then((response) => {
            productPropsData.value = response.data;
            if (
              productPropsData.value.productProps.length &&
              productPropsData.value.productProps
            ) {
              productPropsData.value.productProps.map((el) => {
                return el.availableValues.map((el) => (el.isChecked = false));
              });
            }
          });
      } catch (e) {
        console.error(e);
        productPropsData.value.data = {};
      }
    };

    const { priceFrom, priceTo, categoryId, checkColor } = toRefs(props);

    watch(priceFrom, (val) => {
      currentPriceFrom.value = val;
    });
    watch(priceTo, (val) => {
      currentPriceTo.value = val;
    });
    watch(categoryId, (val) => {
      currentCategoryId.value = val;
    });
    watch(checkColor, (val) => {
      currentCheckColor.value = val;
    });

    watch(currentCategoryId, (val) => {
      if (val) {
        loadProductProps(val);
      } else {
        productPropsData.value = {};
      }
    });

    loadCategories();

    return {
      submit,
      currentPriceFrom,
      currentPriceTo,
      currentCategoryId,
      categories,
      colors,
      currentCheckColor,
      reset,
      productPropsData,
    };
  },
});
</script>
