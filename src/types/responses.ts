export interface WaqfResponse {
  answer: string;
  context: string[];
  metadata?: {
    confidence: number;
    sources: string[];
  };
}

// Example English Response
export const englishResponseExample: WaqfResponse = {
  answer: `
• A Waqf is an Islamic endowment where assets are dedicated for charitable or religious purposes, becoming perpetually owned by Allah.

• The key characteristic of Waqf is its perpetuity - once established, the assets cannot be sold, inherited, or given away.

• Waqf assets can include properties, money, or other valuable items that generate benefits for the community.

• The person establishing the Waqf (Waqif) must be of sound mind, have legal capacity, and own the asset being dedicated.
`,
  context: [
    "Chapter 1: Introduction to Waqf...",
    "Section 2.1: Legal Requirements...",
    "Case Study: Modern Applications..."
  ],
  metadata: {
    confidence: 0.95,
    sources: ["Waqf Handbook 2025", "Islamic Jurisprudence Guide"]
  }
};

// Example Urdu Response
export const urduResponseExample: WaqfResponse = {
  answer: `
• وقف ایک اسلامی عطیہ ہے جہاں اثاثے خیراتی یا مذہبی مقاصد کے لیے وقف کیے جاتے ہیں، جو مستقل طور پر اللہ کی ملکیت بن جاتے ہیں۔

• وقف کی اہم خصوصیت اس کی دوامیت ہے - ایک بار قائم ہونے کے بعد، اثاثوں کو فروخت، وراثت، یا عطیہ نہیں کیا جا سکتا۔

• وقف کے اثاثوں میں جائیدادیں، رقم، یا دیگر قیمتی اشیاء شامل ہو سکتی ہیں جو برادری کے لیے فوائد پیدا کرتی ہیں۔

• وقف قائم کرنے والے شخص (واقف) کو ذہنی طور پر صحت مند، قانونی اہلیت رکھنے والا، اور وقف کیے جانے والے اثاثے کا مالک ہونا چاہیے۔
`,
  context: [
    "باب 1: وقف کا تعارف...",
    "سیکشن 2.1: قانونی تقاضے...",
    "کیس سٹڈی: جدید استعمال..."
  ],
  metadata: {
    confidence: 0.95,
    sources: ["وقف ہینڈ بک 2025", "اسلامی فقہ گائیڈ"]
  }
};
