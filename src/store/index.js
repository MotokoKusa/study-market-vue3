import { createStore } from "vuex";
import axios from "axios";
import { API_BASE_URL } from "@/config";

export default createStore({
  state: {
    cartProducts: [],
    userAccessKey: null,
    cartProductsData: [],
    cartLoading: false,
    cartLoadingFailed: false,
    orderInfo: null,
  },
  mutations: {
    updateOrderInfo(state, orderInfo) {
      state.orderInfo = orderInfo;
    },
    resetCart(state) {
      state.cartProducts = [];
      state.cartProductsData = [];
    },
    updateCartProductAmount(state, { productId, quantity }) {
      const item = state.cartProducts.find(
        (item) => item.productId === productId
      );

      if (item) {
        item.quantity = quantity;
      }
    },
    deleteCartProduct(state, productId) {
      state.cartProducts = state.cartProducts.filter(
        (el) => el.productId !== productId
      );
    },
    updateUserAccessKey(state, accessKey) {
      state.userAccessKey = accessKey;
    },
    updateCartProductsData(state, items) {
      state.cartProductsData = items;
    },
    syncCartProducts(state) {
      console.log("cartProductsData", state.cartProductsData);
      state.cartProducts = state.cartProductsData.map((item) => {
        return {
          productId: item.productOffer?.product?.id,
          cartProductId: item.id,
          quantity: item.quantity,
        };
      });
    },
    updateCartLoading(state, boolean) {
      state.cartLoading = boolean;
    },
    updateCartLoadingFailed(state, boolean) {
      state.cartLoadingFailed = boolean;
    },
  },
  getters: {
    cartDetailProducts(state) {
      return state.cartProducts.map((item) => {
        const productOffer = state.cartProductsData.find(
          (el) => el.productOffer?.product.id === item.productId
        ).productOffer;
        return {
          ...item,
          product: {
            ...productOffer,
            imageSrc: productOffer?.product?.preview?.file?.url,
          },
        };
      });
    },
    cartTotalPrice(state, getters) {
      return getters.cartDetailProducts.reduce(
        (acc, item) => item.product.price * item.quantity + acc,
        0
      );
    },
    cartTotalAmount(state, getters) {
      return getters.cartDetailProducts.reduce(
        (acc, item) => item.quantity + acc,
        0
      );
    },
    isCartLoading(state) {
      return state.cartLoading;
    },
    isCartLoadingFailed(state) {
      return state.cartLoadingFailed;
    },
    orderInfo(state) {
      return state.orderInfo;
    },
  },
  actions: {
    loadOrderInfo(context, orderId) {
      return axios
        .get(API_BASE_URL + "/api/orders/" + orderId, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          context.commit("updateOrderInfo", response.data);
        });
    },
    loadCart(context) {
      context.commit("updateCartLoading", true);
      context.commit("updateCartLoadingFailed", false);
      return axios
        .get(API_BASE_URL + "/api/baskets", {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          if (!context.state.userAccessKey) {
            localStorage.setItem("userAccessKey", response.data.user.accessKey);
            context.commit("updateUserAccessKey", response.data.user.accessKey);
          }

          context.commit("updateCartProductsData", response.data.items);
          context.commit("syncCartProducts");
        })
        .catch((e) => {
          console.log(e);
          context.commit("updateCartLoadingFailed", true);
        })
        .then(() => context.commit("updateCartLoading", false));
    },
    addProductToCart(context, { productOfferId, quantity, colorId }) {
      return new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
        return axios
          .post(
            API_BASE_URL + "/api/baskets/products",
            {
              productOfferId,
              quantity,
              colorId,
            },
            {
              params: {
                userAccessKey: context.state.userAccessKey,
              },
            }
          )
          .then((response) => {
            context.commit("updateCartProductsData", response.data.items);
            context.commit("syncCartProducts");
          });
      });
    },
    updateCartProductAmount(context, { productId, quantity }) {
      context.commit("updateCartProductAmount", { productId, quantity });

      if (quantity < 1) {
        return;
      }
      return axios
        .put(
          API_BASE_URL + "/api/baskets/products",
          {
            productId: productId,
            quantity,
          },
          {
            params: {
              userAccessKey: context.state.userAccessKey,
            },
          }
        )
        .then((response) => {
          context.commit("updateCartProductsData", response.data.items);
        })
        .catch(() => {
          context.commit("syncCartProducts");
        });
    },
    deleteProductToCart(context, productId) {
      context.commit("deleteCartProduct", productId);

      return axios
        .delete(API_BASE_URL + "/api/baskets/products", {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
          data: {
            basketItemId: productId,
          },
        })
        .then((response) => {
          context.commit("updateCartProductsData", response.data.items);
          context.commit("syncCartProducts");
        });
    },
  },
});
