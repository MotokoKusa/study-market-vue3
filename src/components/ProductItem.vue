<template>
  <li class="catalog__item">
    <router-link
      :to="{ name: 'product', params: { id: item.id } }"
      class="catalog__pic"
    >
      <img :src="item.imageSrc" :srcset="item.imageSrcset" :alt="item.title" />
    </router-link>
    <h3 class="catalog__title" @click.prevent="openVisionQuickView(item.id)">
      <a href="#">{{ content.title }}</a>
    </h3>
    <span class="catalog__price">{{ numberFormat(content.price) }} ₽</span>
    <ul class="colors colors--black">
      <li v-for="el in item.colors" :key="el.id" class="colors__item">
        <label class="colors__label">
          <input
            class="colors__radio sr-only"
            type="radio"
            :value="el.color.code"
            v-model="selectedColor"
          />
          <span
            class="colors__value"
            :style="{ 'background-color': el.color.code }"
          ></span>
        </label>
      </li>
    </ul>
    <ul v-if="offersPrice" class="sizes">
      <li v-for="el in offersPrice" :key="el.value" class="sizes__item">
        <label class="sizes__label">
          <input
            class="sizes__radio sr-only"
            type="radio"
            name="sizes-2"
            :value="el"
            v-model="selectedOffersValue"
          />
          <span class="sizes__value"> {{ el.value }} </span>
        </label>
      </li>
    </ul>
  </li>
  <base-modal v-model:open="isQuickViewOpen">
    <product-quick-view :product-id="currentProductId" />
  </base-modal>
</template>

<script>
import numberFormat from "@/helpers/numberFormat";
import BaseModal from "@/components/BaseModal";
import { computed, defineAsyncComponent, defineComponent, ref } from "vue";
// import productPropTypes from "@/types/ProductPropTypes";

export default defineComponent({
  components: {
    BaseModal,
    ProductQuickView: defineAsyncComponent({
      loader: () => import("@/components/ProductQuickView"),
    }),
  },
  props: {
    item: {
      type: Object,
    },
  },
  setup(props) {
    const currentProductId = ref(null);

    const isQuickViewOpen = computed({
      get() {
        return !!currentProductId.value;
      },
      set(isOpen) {
        if (!isOpen) {
          currentProductId.value = null;
        }
      },
    });
    const offersPrice = computed(() => {
      return props.item.offers.reduce((obj, current) => {
        return [
          ...obj,
          {
            title: current.title,
            value: current?.propValues.at(0)?.value,
            price: current.price,
            isActive: false,
          },
        ];
      }, []);
    });
    const selectedOffersValue = ref(null);

    const selectedColor = ref(null);

    const content = computed(() => {
      if (!selectedOffersValue.value) return props.item;
      return offersPrice.value.find(
        (el) => el.value === selectedOffersValue.value.value
      );
    });

    const openVisionQuickView = (productId) => {
      currentProductId.value = productId;
    };

    return {
      selectedColor,
      isQuickViewOpen,
      content,
      openVisionQuickView,
      currentProductId,
      offersPrice,
      selectedOffersValue,
      numberFormat,
    };
  },
});
</script>

<style lang="scss" scoped>
.sizes {
  margin-top: 10px;
}
.catalog__pic {
  display: flex;
  align-items: center;
  justify-content: center;

  & img {
    object-fit: unset;
    max-height: 100%;
    width: auto;
    height: auto;
  }
}
</style>
