import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_...'); // Stripe test key geçici

const products = [
  { id: 1, name: 'Wireless Mouse', price: 19.99, image: '/images/mouse.jpg' },
  { id: 2, name: 'Bluetooth Headphones', price: 39.99, image: '/images/headphones.jpg' },
  { id: 3, name: 'USB-C Hub', price: 29.99, image: '/images/hub.jpg' },
];

export default function Home() {
  const [liked, setLiked] = useState([]);
  const [sort, setSort] = useState('asc');
  const [maxPrice, setMaxPrice] = useState(null);

  const handleLike = (id) => {
    setLiked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleCheckout = async (priceId) => {
    const stripe = await stripePromise;
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId }),
    });
    const session = await res.json();
    await stripe.redirectToCheckout({ sessionId: session.id });
  };

  const displayed = [...products]
    .filter((p) => (maxPrice ? p.price <= maxPrice : true))
    .sort((a, b) => (sort === 'asc' ? a.price - b.price : b.price - a.price));

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Welcome to Pricify Live</h1>
      <p className="text-gray-600 mb-6">Compare product prices across platforms like Amazon, eBay, Walmart & more.</p>

      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => handleCheckout('price_1RakXdHQV8Xgme4YaaUZaayL')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Subscribe Monthly
        </button>
        <button
          onClick={() => handleCheckout('price_1RakjYHQV8Xgme4YjYOLe78r')}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Subscribe Yearly
        </button>
        <select
          onChange={(e) => setSort(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="asc">Sort: Low to High</option>
          <option value="desc">Sort: High to Low</option>
        </select>
        <select
          onChange={(e) => setMaxPrice(parseFloat(e.target.value) || null)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Prices</option>
          <option value="30">Under $30</option>
          <option value="50">Under $50</option>
        </select>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {displayed.map((p) => (
          <div key={p.id} className="border rounded shadow-sm p-4 relative">
            <img src={p.image} alt={p.name} className="w-full h-36 object-cover mb-2" />
            <h2 className="font-semibold">{p.name}</h2>
            <p>${p.price.toFixed(2)}</p>
            <button
              onClick={() => handleLike(p.id)}
              className="absolute top-2 right-2 text-xl"
            >
              {liked.includes(p.id) ? '❤️' : '🤍'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
