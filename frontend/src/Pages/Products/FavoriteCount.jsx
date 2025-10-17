import React from "react";
import { useSelector } from "react-redux";
import { selectFavoriteProducts } from "../../Redux/features/favorites/favoriteSlice";

const FavoriteCount = () => {
  const favorites = useSelector(selectFavoriteProducts) || [];
  const count = favorites.length;

  if (count === 0) return null; // optional: hide badge if no favorites

  return (
    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
      {count}
    </span>
  );
};

export default FavoriteCount;
