import { useState, useEffect } from "react";
import {
  getFavorites,
  saveFavorite,
  removeFavorite,
  isFavorite,
} from "../utils/localStorage";

const products = [
  {
    id: 1,
    name: "Wireless Mouse",
    price: 19.99,
    image: "/mouse.jpg",
  },
  {
    id: 2,
    name: "Bluetooth Headphones",
    price: 39.99,
    image: "/hub.jpg",
  },
  {
    id: 3,
    name: "Keyboard",
    price: 29.99,
    image: "/images/keyboard.jpg",
  },
];

export default function HomePage() {
  const [liked, setLiked] = useState({});

  useEffect(() => {
    const initial = {};
    products.forEach((p) => {
      initial[p.id] = isFavorite(p.id);
    });
    setLiked(initial);
  }, []);

  const toggleFavorite = (product) => {
    const updated = { ...liked };
    if (liked[product.id]) {
      removeFavorite(product.id);
      updated[product.id] = false;
    } else {
      saveFavorite(product);
      updated[product.id] = true;
    }
    setLiked(updated);
  };

  return (
    <div className="p-6">
      {products.map((product) => (
        <div key={product.id} className="border p-4 mb-6 rounded shadow">
          <button onClick={() => toggleFavorite(product)} className="text-2xl mb-2">
            {liked[product.id] ? "❤️" : "🤍"}
          </button>
          <img
            src={product.image}
            className="w-full h-48 object-cover rounded mb-2"
            alt={product.name}
          />
          <h2 className="font-semibold text-lg">{product.name}</h2>
          <p>${product.price.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
}