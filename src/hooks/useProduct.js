import axios from "axios";
import { API_BASE_URL } from "@/config";
import numberFormat from "@/helpers/numberFormat";
import { computed, reactive, ref } from "vue";
import { useStore } from "vuex";

export default function () {
  const productsData = ref(null);
  const product = computed(() => {
    return {
      ...productsData.value,
      imageSrc: productsData.value.image.file.url,
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

  const addingStatus = reactive({
    isAdded: false,
    isSending: false,
  });
  const $store = useStore();
  const addProduct = (productId, quantity) => {
    addingStatus.isAdded = false;
    addingStatus.isSending = true;
    $store
      .dispatch("addProductToCart", {
        productId,
        quantity,
      })
      .then(() => {
        addingStatus.isSending = true;
        addingStatus.isSending = false;
      });
  };

  return {
    product,
    category,
    fetchStatus,
    fetchProduct,
    addingStatus,
    addProduct,
  };
}
