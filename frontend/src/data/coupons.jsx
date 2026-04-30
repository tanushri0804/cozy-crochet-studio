export const coupons = [
  {
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 30,
    isActive: true,
    usedCount: 0,
  },
  {
    code: 'COZY20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 75,
    isActive: true,
    usedCount: 0,
  },
  {
    code: 'FREESHIP',
    discountType: 'fixed',
    discountValue: 8,
    minOrderAmount: 50,
    isActive: true,
    usedCount: 0,
  },
  {
    code: 'HANDMADE15',
    discountType: 'percentage',
    discountValue: 15,
    minOrderAmount: 60,
    isActive: true,
    usedCount: 0,
  },
];

export const validateCoupon = (code, orderTotal) => {
  const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
  
  if (!coupon) {
    return { valid: false, error: 'Invalid coupon code' };
  }
  
  if (!coupon.isActive) {
    return { valid: false, error: 'This coupon is no longer active' };
  }
  
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return { valid: false, error: 'This coupon has expired' };
  }
  
  if (coupon.minOrderAmount && orderTotal < coupon.minOrderAmount) {
    return { valid: false, error: `Minimum order amount of $${coupon.minOrderAmount} required` };
  }
  
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    return { valid: false, error: 'This coupon has reached its usage limit' };
  }
  
  return { valid: true, coupon };
};

export const calculateDiscount = (coupon, subtotal) => {
  if (coupon.discountType === 'percentage') {
    return Math.round((subtotal * coupon.discountValue) / 100 * 100) / 100;
  }
  return Math.min(coupon.discountValue, subtotal);
};
