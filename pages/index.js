import { useState, useEffect } from "react";
import {
  getFavorites,
  saveFavorite,
  removeFavorite,
  isFavorite,
} from "../utils/localStorage";
import Link from "next/link";

const products = [
  { id: 1, name: "Wireless Mouse", price: 19.99, image: "/images/mouse.jpg" },
  { id: 2, name: "Bluetooth Headphones", price: 39.99, image: "/images/hub.jpg" },
  { id: 3, name: "Keyboard", price: 29.99, image: "/images/keyboard.jpg" },
];

export default function Home() {
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState(null);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const toggleFavorite = (product) => {
    if (isFavorite(product.id)) {
      removeFavorite(product.id);
    } else {
      saveFavorite(product);
    }
    setFavorites(getFavorites());
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>All Products</h1>
      <Link href="/favorites">Go to Favorites ❤️</Link>

      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          marginTop: "15px",
          marginBottom: "10px",
          padding: "8px",
          width: "300px",
          fontSize: "16px",
          display: "block",
        }}
      />

      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setSortOrder("asc")} style={{ marginRight: "10px" }}>
          Fiyat: Artan ⬆️
        </button>
        <button onClick={() => setSortOrder("desc")}>
          Fiyat: Azalan ⬇️
        </button>
      </div>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {products
          .filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .sort((a, b) => {
            if (sortOrder === "asc") return a.price - b.price;
            if (sortOrder === "desc") return b.price - a.price;
            return 0;
          })
          .map((product) => (
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
              <button onClick={() => toggleFavorite(product)}>
                {isFavorite(product.id) ? "💖 Remove" : "🤍 Add to Favorites"}
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
// guncellendi
