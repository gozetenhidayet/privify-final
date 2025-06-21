
1 of 3
Gir
Inbox

Hidayet Gozeten <hynngozeten@gmail.com>
9:15 PM (0 minutes ago)
to me

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
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

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

  const filtered = products.filter((p) => {
    const matchName = p.name.toLowerCase().includes(search.toLowerCase());
    const matchPrice = maxPrice === "" || p.price <= parseFloat(maxPrice);
    return matchName && matchPrice;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Products</h1>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search product name..."
          className="border p-2 rounded w-full sm:w-1/2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max price"
          className="border p-2 rounded w-full sm:w-1/2"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

      {filtered.map((product) => (
        <div key={product.id} className="border p-4 mb-6 rounded shadow">
          <button
            onClick={() => toggleFavorite(product)}
            className="text-2xl mb-2"
          >
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

      {filtered.length === 0 && (
        <p className="text-gray-500 mt-6">No products found.</p>
      )}
    </div>
  );
}
