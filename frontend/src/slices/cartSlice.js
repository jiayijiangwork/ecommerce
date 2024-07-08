import { createSlice } from '@reduxjs/toolkit';
import { updateCart } from '../utils/cartUtils';

// 从 localStorage 中获取 cart 数据，如果没有则使用默认初始状态
const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : {
      cartItems: [],
      shippingAddress: {},
      paymentMethod: 'PayPal',
    };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { user, rating, numReviews, reviews, ...item } = action.payload;

      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }

      // 更新购物车后更新本地存储
      updateCart(state, item);
      return state;
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      // 更新购物车后更新本地存储
      updateCart(state);
      return state;
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      // 更新本地存储
      localStorage.setItem('cart', JSON.stringify(state));
      return state;
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      // 更新本地存储
      localStorage.setItem('cart', JSON.stringify(state));
      return state;
    },
    clearCartItems: (state) => {
      state.cartItems = [];
      // 清空购物车后更新本地存储
      localStorage.setItem('cart', JSON.stringify(state));
      return state;
    },
    resetCart: () => initialState,
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;
