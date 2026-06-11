import Razorpay from 'razorpay'

export const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_T0Nw1fEYYo8OtR',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '50xAouMgBbV92KqiR5KaG57R',
})
