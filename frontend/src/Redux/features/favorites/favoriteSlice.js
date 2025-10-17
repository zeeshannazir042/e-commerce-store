import { createSlice } from "@reduxjs/toolkit";

const favoriteSlice = createSlice({
  name: "favorites",
  initialState: [],
  reducers: {
    addToFavorites: (state, action) => {
      if (!state.some((product) => product._id === action.payload._id)) {
        state.push(action.payload);
      }
    },
    removeFromFavorites: (state, action) => {
      return state.filter((product) => product._id !== action.payload._id);
    },
    setFavorites: (state, action) => {
      // Make sure action.payload is always an array
      return Array.isArray(action.payload) ? action.payload : [];
    },
  },
});

export const { addToFavorites, removeFromFavorites, setFavorites } =
  favoriteSlice.actions;

// ✅ Correct selector
export const selectFavoriteProducts = (state) => state.favorites;

export default favoriteSlice.reducer;
