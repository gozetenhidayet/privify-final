import { useEffect, useState } from "react";
import { getFavorites, saveFavorite, removeFavorite, isFavorite } from "../utils/localStorage";
import { calculateScore } from "../utils/score"; // ⭐ Skor hesaplama fonksiyonu
import PriceChart from "../components/PriceChart"; // 📈 Fiyat grafiği
import Link from "next/link";

// Ürün verileri (örnek)
const products = [
  {
    id: 1,
    name: "Wireless Mouse",
    price: 19.99,
    image: "/images/wirelessmouse.png",
    history: [22.99, 21.49, 20.99, 19.99]
  },
  {
    id: 2,
    name: "Laptop",
    price: 39.99,
    image: "/images/laptop.png",
    history: [45.00, 42.50, 41.00, 39.99]
  },
  {
    id: 3,
    name: "Keyboard",
    price: 29.99,
    image: "/images/keyboard.jpg",
    history: [34.99, 32.99, 30.00, 29.99]
  }
];

export default function Home() {
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setFavorites(getFavorites());
    setIsClient(true);
  }, []);

  const toggleFavorite = (product) => {
    if (isFavorite(product.id)) {
      removeFavorite(product.id);
    } else {
      saveFavorite(product);
    }
    setFavorites(getFavorites());
  };

  const filtered = products
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
      <br /><br />

      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: "6px", width: "250px" }}
      />
      <br /><br />

      <button onClick={() => setSortOrder("asc")}>⬆️ Fiyat Artan</button>
      <button onClick={() => setSortOrder("desc")} style={{ marginLeft: "10px" }}>⬇️ Fiyat Azalan</button>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginTop: "20px" }}>
        {filtered.map((product) => (
          <div key={product.id} style={{ border: "1px solid #ccc", padding: "10px", width: "230px", textAlign: "center" }}>
            <img src={product.image} alt={product.name} width="100" height="100" />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <p>⭐ Score: {calculateScore(product.price)}</p>
            {isClient && <PriceChart history={product.history} />}
            <button onClick={() => toggleFavorite(product)}>
              {isFavorite(product.id) ? "💔 Remove" : "🤍 Add to Favorites"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
