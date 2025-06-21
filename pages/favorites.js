import { useEffect, useState } from "react";
import { getFavorites, removeFavorite } from "../utils/localStorage";
import Link from "next/link";
import PriceChart from "../components/PriceChart";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const handleRemove = (id) => {
    removeFavorite(id);
    setFavorites(getFavorites());
  };

  const downloadCSV = () => {
    const headers = ["Product Name", "Price"];
    const rows = favorites.map((item) => [item.name, `$${item.price}`]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      headers.join(",") +
      "\n" +
      rows.map((row) => row.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "favorites.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Your Favorites</h1>
      <Link href="/">
        <a>&larr; Back to Products</a>
      </Link>
      <br />
      <button onClick={downloadCSV} style={{ margin: "10px 0" }}>
        📥 Download CSV
      </button>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {favorites.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              margin: "10px",
              width: "200px",
              textAlign: "center",
            }}
          >
            <img src={item.image} alt={item.name} width="100" />
            <h3>{item.name}</h3>
            <p>${item.price}</p>
            <button onClick={() => handleRemove(item.id)}>🗑️ Remove</button>
            <PriceChart product={item} />
          </div>
        ))}
      </div>
    </div>
  );
}
