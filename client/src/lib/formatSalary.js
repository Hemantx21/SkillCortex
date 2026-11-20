export function formatSalary(salary) {
  if (!salary) return '';
  const amount = String(salary).replace(/^(?:₹|Rs\.?|INR|USD|\$)\s*/i, '').trim();
  return /^competitive$/i.test(amount) ? amount : `Rs. ${amount}`;
}
