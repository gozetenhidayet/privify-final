import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51RakUzHQV8Xgme4YaXt88...SeninPublicKey');

const products = [
  {
    id: 1,
    name: 'Product A',
    price: 29.99,
    image: '/images/product-a.jpg',
  },
  {
    id: 2,
    name: 'Product B',
    price: 19.99,
    image: '/images/product-b.jpg',
  },
  {
    id: 3,
    name: 'Product C',
    price: 39.99,
    image: '/images/product-c.jpg',
  },
];

export default function Home() {
  const [likedProducts, setLikedProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterPrice, setFilterPrice] = useState(null);

  const toggleLike = (id) => {
    setLikedProducts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleCheckout = async (priceId) => {
    const stripe = await stripePromise;
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId }),
    });
    const session = await response.json();
    await stripe.redirectToCheckout({ sessionId: session.id });
  };

  const sortedProducts = [...products]
    .filter((p) => (filterPrice ? p.price <= filterPrice : true))
    .sort((a, b) => (sortOrder === 'asc' ? a.price - b.price : b.price - a.price));

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Welcome to Pricify Live</h1>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <button
          onClick={() => handleCheckout('price_1RakXdHQV8Xgme4YaaUZaayL')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Subscribe Monthly
        </button>
        <button
          onClick={() => handleCheckout('price_1RakjYHQV8Xgme4YjYOLe78r')}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Subscribe Yearly
        </button>
      </div>

      {/* Filter & Sort */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <select
          className="border p-2 rounded"
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc">Sort: Low to High</option>
          <option value="desc">Sort: High to Low</option>
        </select>
        <select
          className="border p-2 rounded"
          onChange={(e) => setFilterPrice(parseFloat(e.target.value) || null)}
        >
          <option value="">Filter by Price</option>
          <option value="20">Under $20</option>
          <option value="30">Under $30</option>
          <option value="40">Under $40</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {sortedProducts.map((product) => (
          <div key={product.id} className="border rounded p-4 shadow relative">
            <img src={product.image} alt={product.name} className="w-full h-40 object-cover mb-2" />
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-gray-700">${product.price.toFixed(2)}</p>
            <button
              onClick={() => toggleLike(product.id)}
              className="absolute top-2 right-2 text-red-500 text-xl"
            >
              {likedProducts.includes(product.id) ? '❤️' : '🤍'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
