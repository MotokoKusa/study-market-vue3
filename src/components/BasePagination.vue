<template>
  <ul class="catalog__pagination pagination">
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
</template>

<script>
export default {
  name: "BasePagination",
  props: ["modelValue", "count", "perPage"],
  computed: {
    pages() {
      return Math.ceil(this.count / this.perPage);
    },
    page() {
      return this.modelValue;
    },
  },
  methods: {
    paginate(page) {
      this.$emit("update:modelValue", page);
    },
    btnClickNext(page) {
      if (this.pages !== this.page) this.paginate(page + 1);
    },
    btnClickPrev(page) {
      if (this.page !== 1) this.paginate(page - 1);
    },
  },
};
</script>
