
1 of 2
Git
Inbox

Hidayet Gozeten <hynngozeten@gmail.com>
9:02 PM (0 minutes ago)
to me

utils/localStorage.js

export const getFavorites = () => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem("favorites");
  return data ? JSON.parse(data) : [];
};

export const saveFavorite = (product) => {
  const favorites = getFavorites();
  const exists = favorites.find((p) => p.id === product.id);
  if (!exists) {
    const updated = [...favorites, product];
    localStorage.setItem("favorites", JSON.stringify(updated));
  }
};

export const removeFavorite = (id) => {
  const favorites = getFavorites();
  const updated = favorites.filter((p) => p.id !== id);
  localStorage.setItem("favorites", JSON.stringify(updated));
};

export const isFavorite = (id) => {
  const favorites = getFavorites();
  return favorites.some((p) => p.id === id);
};
