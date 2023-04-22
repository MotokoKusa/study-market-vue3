import axios from "axios";
import { API_BASE_URL } from "@/config";
import numberFormat from "@/helpers/numberFormat";
import { computed, reactive, ref } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router/dist/vue-router";

export default function () {
  const route = useRoute();
  const productsData = ref(null);
  const product = computed(() => {
    return {
      ...productsData.value,
      imageSrc: productsData.value?.preview?.file?.url,
    };
  });
  const category = computed(() => {
    return productsData.value.category;
  });

  const fetchStatus = reactive({
    isLoading: false,
    isFailed: false,
  });

  const fetchProduct = (productId) => {
    fetchStatus.isLoading = true;
    fetchStatus.isFailed = false;
    axios
      .get(API_BASE_URL + "/api/products/" + productId)
      .then(
        (response) =>
          (productsData.value = {
            ...response.data,
            productPrice: numberFormat(response.data.price),
          })
      )
      .catch(() => (fetchStatus.isFailed = true))
      .then(() => (fetchStatus.isLoading = false));
  };

  const offersPrice = computed(() => {
    if (!productsData.value) return [];
    return product.value.offers.reduce((obj, current) => {
      return [
        ...obj,
        {
          id: current?.id,
          title: current?.title,
          value: current?.propValues?.at(0)?.value,
          price: numberFormat(current?.price),
        },
      ];
    }, []);
  });

  const content = computed(() => {
    if (!selectedOffersValue.value) return offersPrice.value?.at(0);
    return offersPrice.value.find(
      (el) => el.value === selectedOffersValue.value
    );
  });

  const selectedOffersValue = ref(
    route.query.offer || offersPrice.value?.at(0)?.value || null
  );

  const selectedColorValue = ref(
    route.query.color || product.value.colors?.at(0)?.color?.id || null
  );

  const addingStatus = reactive({
    isAdded: false,
    isSending: false,
  });
  const store = useStore();
  const addProduct = (productOfferId, quantity, colorId) => {
    addingStatus.isAdded = false;
    addingStatus.isSending = true;
    store
      .dispatch("addProductToCart", {
        productOfferId,
        quantity,
        colorId,
      })
      .then(() => {
        addingStatus.isSending = true;
        addingStatus.isSending = false;
      });
  };

  const tabs = ref([
    { name: "DescriptionTab", text: "Описание" },
    { name: "SpecificationsTab", text: "Характеристики" },
  ]);
  const selectedTab = ref(tabs.value[0].name);

  const switchTabs = (tab) => {
    selectedTab.value = tab;
  };

  return {
    product,
    category,
    fetchStatus,
    fetchProduct,
    addingStatus,
    addProduct,
    offersPrice,
    selectedOffersValue,
    selectedColorValue,
    content,
    tabs,
    switchTabs,
    selectedTab,
  };
}
