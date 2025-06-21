import { useEffect, useState } from "react";
import { getFavorites, removeFavorite } from "../utils/localStorage";
import Link from "next/link";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const handleRemove = (id) => {
    removeFavorite(id);
    setFavorites(getFavorites());
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Your Favorites</h1>
      <Link href="/">&larr; Back to Products</Link>
      <div style={{ marginTop: "20px" }}>
        {favorites.length === 0 ? (
          <p>No favorites yet.</p>
        ) : (
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {favorites.map((product) => (
              <div
                key={product.id}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  width: "200px",
                  textAlign: "center",
                }}
              >
                <img src={product.image} alt={product.name} width="100" />
                <h3>{product.name}</h3>
                <p>${product.price}</p>
                <button onClick={() => handleRemove(product.id)}>🗑 Remove</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
