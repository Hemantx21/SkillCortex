import { useSearchParams, Link } from 'react-router-dom';

export default function PaymentComplete() {
  const [params] = useSearchParams();
  const orderId = params.get('orderId') || params.get('order_id') || '';
  const status = params.get('status') || '';

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white border border-[#E6E2E0] rounded-2xl p-8 text-center">
        <h2 className="text-[22px] font-extrabold text-[#2E2C2A] mb-3">Payment Complete</h2>
        <p className="text-[13.5px] text-[#9E9894] mb-2">
          {status ? `Status: ${status}` : 'Your payment session has finished.'}
        </p>
        {orderId && <p className="text-[12px] text-[#9E9894] mb-6">Order: {orderId}</p>}
        <p className="text-[12.5px] text-[#4F4945] mb-6">
          UPI payments are confirmed after bank-statement reconciliation. You will be notified once reconciled.
        </p>
        <Link to="/" className="inline-block px-6 py-2.5 rounded-xl bg-[#2E2C2A] text-white font-semibold hover:bg-[#4F4945] transition-colors">
          Back to home
        </Link>
      </div>
    </div>
  );
}