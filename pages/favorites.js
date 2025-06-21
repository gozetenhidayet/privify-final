import { useEffect, useState } from 'react';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const likedIds = JSON.parse(localStorage.getItem('likedProducts')) || [];

    const allProducts = [
      { id: 1, name: 'Wireless Mouse', price: 19.99, image: '/images/mouse.jpg' },
      { id: 2, name: 'Bluetooth Headphones', price: 39.99, image: '/images/headphones.jpg' },
      { id: 3, name: 'USB-C Hub', price: 29.99, image: '/images/hub.jpg' },
    ];

    const likedProducts = allProducts.filter(p => likedIds.includes(p.id));
    setFavorites(likedProducts);
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Favorites</h1>
      {favorites.length === 0 ? (
        <p>No favorites yet. Go back and ❤️ some products!</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favorites.map(product => (
            <div key={product.id} className="border rounded p-4 shadow">
              <img src={product.image} alt={product.name} className="w-full h-36 object-cover mb-3" />


              <h2 className="font-semibold">{product.name}</h2>
              <p>${product.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
