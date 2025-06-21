import { useEffect, useState } from "react";

export default function MyApp({ Component, pageProps }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") setDarkMode(true);
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? "#121212" : "#ffffff";
    document.body.style.color = darkMode ? "#e0e0e0" : "#000000";
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <>
      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 1000,
          backgroundColor: darkMode ? "#444" : "#ddd",
          color: darkMode ? "#fff" : "#000",
          border: "none",
          borderRadius: "4px",
          padding: "8px 12px",
          cursor: "pointer",
        }}
      >
        {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
      </button>

      <Component {...pageProps} />
    </>
  );
}
