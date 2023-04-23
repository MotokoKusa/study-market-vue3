<template>
  <div class="catalog__pagination">
    <ul class="pagination">
      <li class="pagination__item">
        <a
          @click.prevent="btnClickPrev(page)"
          class="pagination__link pagination__link--arrow"
          aria-label="Предыдущая страница"
          :class="{ 'pagination__link--disabled': page === 1 }"
        >
          <svg width="8" height="14" fill="currentColor">
            <use xlink:href="#icon-arrow-left"></use>
          </svg>
        </a>
      </li>

      <li class="pagination__item" v-for="el in pages" :key="el">
        <a
          href="#"
          class="pagination__link"
          :class="{ 'pagination__link--current': el === page }"
          @click.prevent="paginate(el)"
        >
          {{ el }}
        </a>
      </li>

      <li class="pagination__item">
        <a
          @click.prevent="btnClickNext(page)"
          class="pagination__link pagination__link--arrow"
          href="#"
          aria-label="Следующая страница"
          :class="{ 'pagination__link--disabled': page === pages }"
        >
          <svg width="8" height="14" fill="currentColor">
            <use xlink:href="#icon-arrow-right"></use>
          </svg>
        </a>
      </li>
    </ul>
    <custom-counter v-model="perPageProducts" />
  </div>
</template>

<script>
import customCounter from "@/components/CustomCounter";
import { computed, defineComponent } from "vue";

export default defineComponent({
  props: ["modelValue", "count", "perPage"],
  components: {
    customCounter,
  },
  setup(props, { emit }) {
    const pages = computed(() => {
      return Math.ceil(props.count / perPageProducts.value);
    });
    const page = computed(() => props.modelValue);

    const perPageProducts = computed({
      get() {
        return props.perPage;
      },
      set(value) {
        if (value <= 0) {
          emit("update:perPage", 1);
        } else {
          emit("update:perPage", value);
        }
      },
    });

    const paginate = (page) => emit("update:modelValue", page);
    const btnClickNext = (val) => {
      if (pages.value !== page.value) paginate(val + 1);
    };
    const btnClickPrev = (val) => {
      if (page.value !== 1) paginate(val - 1);
    };

    return {
      pages,
      page,
      paginate,
      btnClickPrev,
      btnClickNext,
      perPageProducts,
    };
  },
});
</script>
