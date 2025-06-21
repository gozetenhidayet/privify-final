import { useState, useEffect } from "react";
import {
  getFavorites,
  saveFavorite,
  removeFavorite,
  isFavorite
} from "../utils/localStorage";
import Link from "next/link";
import { calculateScore } from "../utils/score";
import PriceChart from "../components/PriceChart";

const products = [
  { id: 1, name: "Wireless Mouse", price: 19.99, image: "/images/wirelessmouse.png", history: [20, 21, 19.5, 19.99] },
  { id: 2, name: "Laptop", price: 39.99, image: "/images/laptop.png", history: [40, 39.99, 42, 38] },
  { id: 3, name: "Keyboard", price: 29.99, image: "/images/keyboard.jpg", history: [30, 29.5, 28.99, 29.99] }
];

export default function Home() {
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
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

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "asc") return a.price - b.price;
      if (sortOrder === "desc") return b.price - a.price;
      return 0;
    });

  return (
    <div style={{ padding: "20px" }}>
      <h1>All Products</h1>
      <Link href="/favorites">Go to Favorites ❤️</Link>
      <br />
      <br />
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: "5px", marginBottom: "10px" }}
      />
      <div>
        <button onClick={() => setSortOrder("asc")}>Fiyat: Artan ⏫</button>
        <button onClick={() => setSortOrder("desc")}>Fiyat: Azalan ⏬</button>
      </div>
      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              width: "200px",
              textAlign: "center"
            }}
          >
            <img src={product.image} alt={product.name} width="100" />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <p>⭐ Score: {calculateScore(product.price)}</p>
            {isClient && <PriceChart history={product.history} />}
            <button onClick={() => toggleFavorite(product)}>
              {isFavorite(product.id) ? "❤️ Remove" : "🤍 Add to Favorites"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
