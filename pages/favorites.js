import { useEffect, useState } from "react";
import Link from "next/link";
import { getFavorites, removeFavorite } from "../utils/localStorage";
import { calculateScore } from "../utils/score";
import PriceChart from "../components/PriceChart";
import jsPDF from "jspdf";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Favorite Products", 10, 10);

    let y = 20;
    favorites.forEach((item, index) => {
      doc.setFontSize(12);
      doc.text(`${index + 1}. ${item.name} - $${item.price} - ⭐ ${calculateScore(item.price)}`, 10, y);
      y += 10;
    });

    doc.save("favorites.pdf");
  };

  const filteredFavorites = favorites.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1>Your Favorites</h1>
      <p>
        ← <Link href="/">Back to Products</Link>
      </p>

      <div style={{ margin: "15px 0" }}>
        <button onClick={downloadCSV} style={{ marginRight: "10px" }}>
          📥 Download CSV
        </button>
        <button onClick={downloadPDF}>🖨️ Download PDF</button>
      </div>

      {/* 🔍 Arama kutusu */}
      <input
        type="text"
        placeholder="Search favorites..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: "6px", width: "250px", marginBottom: "20px" }}
      />

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {filteredFavorites.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              width: "250px",
              textAlign: "center",
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              width="100"
              height="100"
            />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <p>⭐ Score: {calculateScore(product.price)}</p>
            <PriceChart history={product.history || [product.price]} />
            <button onClick={() => handleRemove(product.id)}>🗑️ Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}
