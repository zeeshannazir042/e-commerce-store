import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
  products: [],         // renamed from `product` to `products`
  checked: [],
  radio: [],
  brandCheckBoxes: {},
  checkedBrands: [],
  selectedBrand: "",    // added selectedBrand here
};

const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = Array.isArray(action.payload) ? action.payload : [];
    },
    setProducts: (state, action) => {
      state.products = Array.isArray(action.payload) ? action.payload : [];
    },
    setChecked: (state, action) => {
      state.checked = action.payload;
    },
    setRadio: (state, action) => {
      state.radio = action.payload;
    },
    setSelectedBrand: (state, action) => {
      state.selectedBrand = action.payload;
    },
  },
});

export const {
  setCategories,
  setProducts,
  setChecked,
  setRadio,
  setSelectedBrand,
} = shopSlice.actions;

export default shopSlice.reducer;
