import { useEffect, useState } from "react";
import {
  getFavorites,
  saveFavorite,
  removeFavorite,
  isFavorite,
} from "../utils/localStorage";
import { calculateScore } from "../utils/score";
import { getComments, addComment } from "../utils/comments";
import { getRecommended } from "../utils/recommend";
import PriceChart from "../components/PriceChart";
import Link from "next/link";

const products = [
  {
    id: 1,
    name: "Wireless Mouse",
    category: "Mouse",
    price: 19.99,
    image: "/images/wirelessmouse.png",
    history: [24.99, 22.99, 21.99, 19.99],
  },
  {
    id: 2,
    name: "Laptop",
    category: "Laptop",
    price: 39.99,
    image: "/images/laptop.png",
    history: [45, 43, 41, 39.99],
  },
  {
    id: 3,
    name: "Keyboard",
    category: "Keyboard",
    price: 29.99,
    image: "/images/keyboard.jpg",
    history: [34, 32, 30, 29.99],
  },
];

export default function Home() {
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [alerts, setAlerts] = useState({});
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setFavorites(getFavorites());
    setIsClient(true);
    const loaded = {};
    products.forEach((p) => {
      loaded[p.id] = getComments(p.id);
    });
    setComments(loaded);
  }, []);

  const toggleFavorite = (product) => {
    if (isFavorite(product.id)) {
      removeFavorite(product.id);
    } else {
      saveFavorite(product);
    }
    setFavorites(getFavorites());
  };

  const handleAddComment = (id) => {
    if (newComment[id]) {
      addComment(id, newComment[id]);
      setComments({ ...comments, [id]: [...(comments[id] || []), newComment[id]] });
      setNewComment({ ...newComment, [id]: "" });
    }
  };

  const filteredProducts = products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory === "All" || product.category === selectedCategory)
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
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: "5px", width: "250px" }}
      />

      <div style={{ marginTop: "10px" }}>
        <button onClick={() => setSelectedCategory("All")}>All</button>
        <button onClick={() => setSelectedCategory("Mouse")}>Mouse</button>
        <button onClick={() => setSelectedCategory("Laptop")}>Laptop</button>
        <button onClick={() => setSelectedCategory("Keyboard")}>Keyboard</button>
      </div>

      <div style={{ marginTop: "10px" }}>
        <button onClick={() => setSortOrder("asc")}>⬆️ Fiyat Artan</button>
        <button onClick={() => setSortOrder("desc")} style={{ marginLeft: "10px" }}>
          ⬇️ Fiyat Azalan
        </button>
      </div>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginTop: "20px" }}>
        {filteredProducts.map((product) => {
          const recommended = getRecommended(product, products);
          return (
            <div key={product.id} style={{ border: "1px solid #ccc", padding: "10px", width: "250px", textAlign: "center" }}>
              <img src={product.image} alt={product.name} width="100" />
              <h3>{product.name}</h3>
              <p>${product.price}</p>
              <p>⭐ Score: {calculateScore(product.price)}</p>
              {isClient && <PriceChart history={product.history} />}

              {/* 🔔 Fiyat Alarmı */}
              <input
                type="number"
                placeholder="Alert below $"
                value={alerts[product.id] || ""}
                onChange={(e) =>
                  setAlerts({ ...alerts, [product.id]: e.target.value })
                }
                style={{ marginTop: "8px", width: "90%", padding: "5px" }}
              />
              {alerts[product.id] && product.price < Number(alerts[product.id]) && (
                <p style={{ color: "red", fontWeight: "bold", fontSize: "14px" }}>
                  🚨 Price dropped below your alert!
                </p>
              )}

              {/* 💬 Yorum Alanı */}
              <div style={{ marginTop: "10px" }}>
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={newComment[product.id] || ""}
                  onChange={(e) =>
                    setNewComment({ ...newComment, [product.id]: e.target.value })
                  }
                  style={{ width: "90%", padding: "5px" }}
                />
                <button onClick={() => handleAddComment(product.id)} style={{ marginTop: "5px" }}>
                  ➕ Add Comment
                </button>
                <div style={{ marginTop: "10px", textAlign: "left" }}>
                  {comments[product.id]?.map((c, i) => (
                    <p key={i} style={{ fontSize: "13px", marginBottom: "4px" }}>
                      💬 {c}
                    </p>
                  ))}
                </div>
              </div>

              {/* 🤖 Önerilen Ürün */}
              {isClient && recommended && (
                <div style={{ marginTop: "10px", fontSize: "13px", backgroundColor: "#f0f0f0", padding: "5px" }}>
                  🔁 Recommended: <strong>{recommended.name}</strong>
                </div>
              )}

              <button onClick={() => toggleFavorite(product)} style={{ marginTop: "10px" }}>
                {isFavorite(product.id) ? "💔 Remove" : "🤍 Add to Favorites"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
