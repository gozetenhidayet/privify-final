import { useEffect, useState } from "react";
import { getFavorites, removeFavorite } from "../utils/localStorage";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const handleRemove = (id) => {
    removeFavorite(id);
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Favorites</h1>
      {favorites.length === 0 ? (
        <p>No favorite products yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((product) => (
            <div key={product.id} className="border p-4 rounded shadow">
              <button
                onClick={() => handleRemove(product.id)}
                className="text-2xl mb-2"
              >
                ❌
              </button>
              <img
                src={product.image}
                className="w-full h-48 object-cover rounded mb-2"
                alt={product.name}
              />
              <h2 className="font-semibold">{product.name}</h2>
              <p>${product.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
