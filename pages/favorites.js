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

  const downloadCSV = () => {
    const headers = ["Product Name", "Price"];
    const rows = favorites.map(item => [item.name, `$${item.price}`]);

    let csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(",") + "\n"
      + rows.map(row => row.join(",")).join("\n");

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
      <Link href="/">&larr; Back to Products</Link>

      {favorites.length > 0 && (
        <button
          onClick={downloadCSV}
          style={{
            marginTop: "15px",
            padding: "8px 12px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          📥 Download CSV
        </button>
      )}

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
