export default function Home() {
  const subscribe = async (plan) => {
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    });

    const data = await res.json();
    window.location.href = data.url;
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to Pricify Live 🎉</h1>
      <p>Your smart price comparison site is now live!</p>

      <br /><br />
      <button onClick={() => subscribe('monthly')}>
        Aylık Üyelik ($29)
      </button>
      <br /><br />
      <button onClick={() => subscribe('yearly')}>
        Yıllık Üyelik ($300)
      </button>
    </div>
  );
}
