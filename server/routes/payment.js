import express from 'express';
import crypto from 'crypto';

const router = express.Router();

const GATEWAY_URL = process.env.YOUPI_GATEWAY_URL || '';
const MERCHANT_ID = process.env.YOUPI_MERCHANT_ID || '';
const WEBHOOK_SECRET = process.env.YOUPI_WEBHOOK_SECRET || '';

// Create a payment session via YouPI-PG and return checkout URL
router.post('/create', async (req, res) => {
  try {
    const { plan, amount, currency = 'INR', returnUrl } = req.body || {};
    if (!plan || amount === undefined) {
      return res.status(400).json({ message: 'plan and amount are required' });
    }
    if (!GATEWAY_URL || !MERCHANT_ID) {
      return res.status(503).json({ message: 'Payment gateway is not configured on the server' });
    }

    const orderId = `SC-${plan}-${Date.now()}`;
    const payload = {
      orderId,
      amount: Number(amount).toFixed(2),
      currency,
      returnUrl: returnUrl || `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment/complete`,
      metadata: { plan }
    };

    const gwRes = await fetch(`${GATEWAY_URL.replace(/\/$/, '')}/api/v1/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Merchant-Id': MERCHANT_ID
      },
      body: JSON.stringify(payload)
    });

    const data = await gwRes.json().catch(() => ({}));
    if (!gwRes.ok) {
      return res.status(gwRes.status).json({ message: data.message || 'Failed to create payment', detail: data });
    }
    return res.json({
      paymentId: data.paymentId,
      orderId: data.orderId || orderId,
      amount: data.amount || payload.amount,
      status: data.status || 'ACTIVE',
      checkoutUrl: data.checkoutUrl
    });
  } catch (err) {
    console.error('Payment create error:', err);
    const isNetwork = err && (err.code === 'ECONNREFUSED' || /fetch failed/i.test(err.message || ''));
    const message = isNetwork
      ? 'Payment gateway is not reachable. Please ensure YouPI-PG is running and configured.'
      : 'Server error creating payment';
    return res.status(isNetwork ? 503 : 500).json({ message, error: err.message });
  }
});

// Verify webhook signature (constant-time)
function verifySignature(rawBody, signature) {
  if (!WEBHOOK_SECRET || !signature) return false;
  const sig = String(signature).replace(/^sha256=/, '');
  const expected = crypto.createHmac('sha256', WEBHOOK_SECRET).update(rawBody || '').digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'));
  } catch {
    return false;
  }
}

// Receive YouPI-PG webhook events
router.post('/webhook', (req, res) => {
  const signature = req.headers['x-gateway-signature'];
  const rawBody = req.rawBody || (req.body ? JSON.stringify(req.body) : '');

  if (!verifySignature(rawBody, signature)) {
    return res.status(400).send('Invalid signature');
  }

  let event;
  try {
    event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    event = {};
  }

  // Handle events (log + store). Do not fulfill on OBSERVED_SUCCESS.
  switch (event.event) {
    case 'OBSERVED_SUCCESS':
      console.log('Payment observed (not reconciled):', event.orderId, event.paymentId);
      break;
    case 'RECONCILED':
      if (event.method === 'UPI' && event.settlementState === 'RECONCILED') {
        console.log('Payment reconciled — fulfill order:', event.orderId, event.metadata);
      }
      break;
    case 'MANUAL_REVIEW':
      console.log('Payment manual review:', event.orderId);
      break;
    case 'SUCCESS':
      console.log('COD/counter success:', event.orderId, event.method);
      break;
    case 'FAILED':
      console.log('Payment failed:', event.orderId);
      break;
    case 'EXPIRED':
      console.log('Payment expired:', event.orderId);
      break;
    case 'CANCELLED':
      console.log('Payment cancelled:', event.orderId);
      break;
    default:
      console.log('Unknown payment event:', event);
  }

  return res.status(200).json({ received: true });
});

// Payment completion redirect target (optional)
router.get('/status/:orderId', (req, res) => {
  return res.json({ orderId: req.params.orderId, status: 'PENDING' });
});

export default router;
