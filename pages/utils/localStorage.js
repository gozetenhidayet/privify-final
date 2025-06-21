export const getFavorites = () => {
  if (typeof window === "undefined") return [];
  const favorites = localStorage.getItem("favorites");
  return favorites ? JSON.parse(favorites) : [];
};

export const saveFavorite = (product) => {
  if (typeof window === "undefined") return;
  const favorites = getFavorites();
  if (!favorites.some((fav) => fav.id === product.id)) {
    favorites.push(product);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
};

export const removeFavorite = (productId) => {
  if (typeof window === "undefined") return;
  const favorites = getFavorites().filter((item) => item.id !== productId);
  localStorage.setItem("favorites", JSON.stringify(favorites));
};

export const isFavorite = (productId) => {
  if (typeof window === "undefined") return false;
  return getFavorites().some((item) => item.id === productId);
}
