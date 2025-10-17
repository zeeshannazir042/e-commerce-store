import React, { useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {
  addToFavorites,
  removeFromFavorites,
  setFavorites,
} from "../../Redux/features/favorites/favoriteSlice";
import {
  addFavoriteToLocalStorage,
  removeFavoriteFromLocalStorage,
  getFavoriteFromLocalStorage,
} from "../../Utils/localStorage";

function HeartIcon({ product }) {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites) || [];
  const isFavorite = favorites.some((p) => p._id === product._id);

  // ✅ Load favorites from localStorage on component mount
  useEffect(() => {
    const favoritesFromLocalStorage = getFavoriteFromLocalStorage();
    if (favoritesFromLocalStorage?.length) {
      dispatch(setFavorites(favoritesFromLocalStorage));
    }
  }, [dispatch]);

  // ✅ Handle toggle favorite
  const toggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites(product));
      removeFavoriteFromLocalStorage(product._id);
    } else {
      dispatch(addToFavorites(product));
      addFavoriteToLocalStorage(product);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-all duration-300"
      aria-label="Toggle favorite"
    >
      {isFavorite ? (
        <FaHeart className="text-pink-600 text-2xl transition-transform transform scale-110" />
      ) : (
        <FaRegHeart className="text-gray-400 text-2xl hover:text-pink-500 transition-colors" />
      )}
    </button>
  );
}

export default HeartIcon;
