import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PLANS = [
  { name: 'Starter', price: 0, interval: 'free', desc: 'For individuals starting out.', features: ['5 mock interviews', 'Resume parser', 'Basic quiz access'] },
  { name: 'Pro', price: 19, interval: '/mo', desc: 'For serious interview prep.', features: ['Unlimited interviews', 'AJ Assistant feedback', 'Skill Points & rewards', 'Priority support'] },
  { name: 'Team', price: 49, interval: '/mo', desc: 'For hiring teams and coaches.', features: ['Everything in Pro', 'Candidate management', 'Team analytics', 'Custom branding'] },
];

export function PriceRoll({ className = '' }) {
  const [interval, setInterval] = useState('mo');
  const [paying, setPaying] = useState(null);

const handleChoose = async (plan) => {
    const price = interval === 'yr' ? Math.round(plan.price * 12 * 0.8) : plan.price;
    setPaying(plan.name);
    try {
      const base = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${base}/api/payment/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: plan.name, amount: price, currency: 'INR' })
      });
      const data = await res.json();
      if (!res.ok || !data.checkoutUrl) {
        alert(data.message || 'Could not start payment. Please try again.');
        return;
      }
      window.location.href = data.checkoutUrl;
    } catch (err) {
      console.error('Payment error:', err);
      alert('Cannot reach the payment service. Make sure the backend server is running (port 3001) and try again.');
    } finally {
      setPaying(null);
    }
  };

  return (
    <section className={`relative max-w-[1000px] mx-auto px-5 lg:px-8 py-16 ${className}`}>
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-[26px] font-extrabold text-[#2E2C2A] tracking-tight">Simple, transparent pricing</h2>
        <div className="inline-flex items-center gap-2 rounded-xl border border-[#E6E2E0] bg-white px-1 py-1">
          <button
            onClick={() => setInterval('mo')}
            className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors ${
              interval === 'mo' ? 'bg-[#2E2C2A] text-white' : 'text-[#9E9894] hover:text-[#2E2C2A]'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setInterval('yr')}
            className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors ${
              interval === 'yr' ? 'bg-[#2E2C2A] text-white' : 'text-[#9E9894] hover:text-[#2E2C2A]'
            }`}
          >
            Yearly <span className="ml-2 text-[11px] opacity-60">Save 20%</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => {
          const price = interval === 'yr' ? Math.round(plan.price * 12 * 0.8) : plan.price;
          return (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: PLANS.indexOf(plan) * 0.08 }}
              className="rounded-[24px] border border-[#E6E2E0] bg-white p-8 md:p-10 card-hover shadow-sm"
            >
              <h3 className="text-[18px] font-bold text-[#2E2C2A]">{plan.name}</h3>
              <p className="mt-2 text-[13px] text-[#9E9894]">{plan.desc}</p>
              <div className="mt-6 mb-6">
                <span className="text-[40px] font-extrabold tabular text-[#2E2C2A]">${price}</span>
                <span className="text-[14px] text-[#9E9894]">{plan.interval}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[13px] text-[#9E9894]">
                    <span className="w-4 h-4 rounded-full bg-[#2E2C2A]/10 text-[#2E2C2A] flex items-center justify-center text-[10px] font-bold"></span>
                    {f}
                  </li>
                ))}
              </ul>
<button
                onClick={() => handleChoose(plan)}
                disabled={paying === plan.name}
                className="w-full py-3 rounded-xl bg-[#2E2C2A] text-white font-semibold hover:bg-[#4F4945] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {paying === plan.name ? 'Redirecting…' : `Choose ${plan.name}`}
              </button>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
