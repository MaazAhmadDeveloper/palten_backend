import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  question: String,
  answer: String,
  date: { type: Date, default: Date.now }
});

export const Faqs = mongoose.model('FAQ', faqSchema);