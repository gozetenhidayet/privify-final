import { useEffect, useState } from "react";
import {
  getFavorites,
  saveFavorite,
  removeFavorite,
  isFavorite,
} from "../utils/localStorage";
import {
  getComments,
  addComment,
  deleteComment,
  updateComment,
} from "../utils/comments";
import { calculateScore } from "../utils/score";
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
    history: [24.99, 22.99, 20.99, 19.99],
    variants: ["Black", "White"],
    stock: 3,
  },
  {
    id: 2,
    name: "Laptop",
    category: "Laptop",
    price: 39.99,
    image: "/images/laptop.png",
    history: [45, 43, 42, 39.99],
    variants: ["13 inch", "15 inch"],
    stock: 2,
  },
  {
    id: 3,
    name: "Keyboard",
    category: "Keyboard",
    price: 29.99,
    image: "/images/keyboard.jpg",
    history: [34, 32, 30, 29.99],
    variants: ["Standard", "Mechanical"],
    stock: 1,
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
  const [editing, setEditing] = useState({});
  const [selectedVariants, setSelectedVariants] = useState({});
  const [stockLevels, setStockLevels] = useState({});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setFavorites(getFavorites());
    setIsClient(true);

    const loadedComments = {};
    products.forEach((p) => {
      loadedComments[p.id] = getComments(p.id);
    });
    setComments(loadedComments);

    const stockData = {};
    products.forEach((p) => {
      stockData[p.id] = p.stock;
    });
    setStockLevels(stockData);
  }, []);

  const toggleFavorite = (product) => {
    if (stockLevels[product.id] <= 0 && !isFavorite(product.id)) return;

    const variant = selectedVariants[product.id] || product.variants?.[0];
    const productWithVariant = { ...product, variant };

    if (isFavorite(product.id)) {
      removeFavorite(product.id);
      setStockLevels({
        ...stockLevels,
        [product.id]: stockLevels[product.id] + 1,
      });
    } else {
      saveFavorite(productWithVariant);
      setStockLevels({
        ...stockLevels,
        [product.id]: stockLevels[product.id] - 1,
      });
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

  const handleDeleteComment = (id, index) => {
    deleteComment(id, index);
    const updated = [...comments[id]];
    updated.splice(index, 1);
    setComments({ ...comments, [id]: updated });
  };

  const handleEditComment = (id, index) => {
    setEditing({ ...editing, [id]: index });
    setNewComment({ ...newComment, [id]: comments[id][index] });
  };

  const handleSaveEdit = (id, index) => {
    updateComment(id, index, newComment[id]);
    const updated = [...comments[id]];
    updated[index] = newComment[id];
    setComments({ ...comments, [id]: updated });
    setEditing({ ...editing, [id]: null });
    setNewComment({ ...newComment, [id]: "" });
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
          const currentVariant = selectedVariants[product.id] || product.variants?.[0];

          return (
            <div key={product.id} style={{ border: "1px solid #ccc", padding: "10px", width: "250px", textAlign: "center" }}>
              <img src={product.image} alt={product.name} width="100" />
              <h3>{product.name}</h3>
              <p>${product.price}</p>
              <p>⭐ Score: {calculateScore(product.price)}</p>
              <p>📦 Stock: {stockLevels[product.id]}</p>
              {stockLevels[product.id] <= 0 && (
                <p style={{ color: "red", fontWeight: "bold" }}>❌ Out of stock</p>
              )}

              {isClient && <PriceChart history={product.history} />}

              {/* 🔄 Varyant */}
              {product.variants && (
                <select
                  value={currentVariant}
                  onChange={(e) =>
                    setSelectedVariants({ ...selectedVariants, [product.id]: e.target.value })
                  }
                  style={{ marginTop: "8px" }}
                >
                  {product.variants.map((v, i) => (
                    <option key={i} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              )}

              {/* 🔔 Alarm */}
              <input
                type="number"
                placeholder="Alert below $"
                value={alerts[product.id] || ""}
                onChange={(e) =>
                  setAlerts({ ...alerts, [product.id]: e.target.value })
                }
                style={{ width: "90%", padding: "5px", marginTop: "8px" }}
              />
              {alerts[product.id] && product.price < Number(alerts[product.id]) && (
                <p style={{ color: "red", fontWeight: "bold", fontSize: "14px" }}>
                  🚨 Price dropped below your alert!
                </p>
              )}

              {/* 💬 Yorum */}
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
                {editing[product.id] !== null && editing[product.id] !== undefined ? (
                  <button onClick={() => handleSaveEdit(product.id, editing[product.id])}>
                    💾 Save
                  </button>
                ) : (
                  <button onClick={() => handleAddComment(product.id)}>
                    ➕ Add Comment
                  </button>
                )}

                <div style={{ marginTop: "10px", textAlign: "left" }}>
                  {comments[product.id]?.map((c, i) => (
                    <div key={i} style={{ fontSize: "13px", marginBottom: "4px" }}>
                      💬 {c}
                      <button onClick={() => handleEditComment(product.id, i)} style={{ marginLeft: "5px" }}>
                        ✏️
                      </button>
                      <button onClick={() => handleDeleteComment(product.id, i)} style={{ marginLeft: "5px" }}>
                        🗑
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 🤖 Öneri */}
              {isClient && recommended && (
                <div style={{ marginTop: "10px", fontSize: "13px", backgroundColor: "#f0f0f0", padding: "5px" }}>
                  🔁 Recommended: <strong>{recommended.name}</strong>
                </div>
              )}

              {/* 💖 Favori */}
              <button
                onClick={() => toggleFavorite(product)}
                disabled={stockLevels[product.id] <= 0 && !isFavorite(product.id)}
                style={{ marginTop: "10px" }}
              >
                {isFavorite(product.id) ? "💔 Remove" : "🤍 Add to Favorites"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
