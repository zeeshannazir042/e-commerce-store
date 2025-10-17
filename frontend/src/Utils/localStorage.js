// Add a product to Favorites
export const addFavoriteToLocalStorage = (product) => {
    const favorites = getFavoriteFromLocalStorage();
    if (!favorites.some((p) => p._id === product._id)) {
        favorites.push(product);
        localStorage.setItem('favorites', JSON.stringify(favorites)); // ✅ use 'favorites'
    }
};

// Remove product from Favorites
export const removeFavoriteFromLocalStorage = (productId) => {
    const favorites = getFavoriteFromLocalStorage();
    const updatedFavorites = favorites.filter((product) => product._id !== productId);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // ✅ consistent key
};

// Get favorites from localStorage
export const getFavoriteFromLocalStorage = () => {
    const favoritesJSON = localStorage.getItem('favorites'); // ✅ matches the key
    return favoritesJSON ? JSON.parse(favoritesJSON) : [];
};
