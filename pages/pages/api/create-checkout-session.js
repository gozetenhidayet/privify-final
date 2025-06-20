import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { priceId } = req.body;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${req.headers.origin}/?success=true`,
      cancel_url: `${req.headers.origin}/?canceled=true`,
    });

    res.status(200).json({ id: session.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
