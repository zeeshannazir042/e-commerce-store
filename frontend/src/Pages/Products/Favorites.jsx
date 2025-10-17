import React from "react";
import { useSelector } from "react-redux";
import { selectFavoriteProducts } from "../../Redux/features/favorites/favoriteSlice";
import Product from "./Product";

function Favorites() {
  const favorites = useSelector(selectFavoriteProducts);

  return (
    <div className="flex">
      {/* ✅ Main content (adjusts for sidebar) */}
      <main className="flex-1 lg:ml-20 xl:ml-24 px-4 sm:px-6 md:px-10 py-8 bg-gray-50 min-h-screen transition-all">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-800 text-center md:text-left">
          Your Favorite Products ❤️
        </h2>

        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-gray-600 text-lg mb-4">
              You haven’t added any favorites yet.
            </p>
            <a
              href="/products"
              className="bg-pink-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-pink-700 transition"
            >
              Browse Products
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
            {favorites.map((product) => (
              <div
                key={product._id}
                className="w-full max-w-sm flex justify-center"
              >
                <Product product={product} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Favorites;
