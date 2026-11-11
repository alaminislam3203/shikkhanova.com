export interface RawQuestion {
  q: string;
  options: [string, string, string, string];
  ans: number; // 0, 1, 2, 3
  explanation?: string;
  isPremium?: boolean;
}

// 🎁 Class-wise Free Model Test Questions (5 per class, directly matching & enhancing user's code)
export const FREE_CLASS_QUESTIONS: Record<number, RawQuestion[]> = {
  5: [
    {
      q: 'বাংলা বর্ণমালায় স্বরবর্ণ কয়টি?',
      options: ['৯টি', '১১টি', '১২টি', '১০টি'],
      ans: 1,
      explanation: 'বাংলা বর্ণমালায় মোট ১১টি স্বরবর্ণ রয়েছে (অ, আ, ই, ঈ, উ, ঊ, ঋ, এ, ঐ, ও, ঔ)।',
    },
    {
      q: '৫ × ৬ = কত?',
      options: ['২৫', '৩০', '৩৫', '৪০'],
      ans: 1,
      explanation: '৫ এর সাথে ৬ গুণ করলে গুণফল ৩০ হয়।',
    },
    {
      q: 'বাংলাদেশের রাজধানী কোনটি?',
      options: ['চট্টগ্রাম', 'ঢাকা', 'খুলনা', 'রাজশাহী'],
      ans: 1,
      explanation: 'বাংলাদেশের সাংবিধানিক রাজধানী হলো ঢাকা।',
    },
    {
      q: 'সূর্য কোন দিকে ওঠে?',
      options: ['পশ্চিম', 'উত্তর', 'পূর্ব', 'দক্ষিণ'],
      ans: 2,
      explanation: 'পৃথিবী পশ্চিম থেকে পূর্বে ঘোরে, ফলে সূর্য সর্বদা পূর্ব দিকে উদিত হয়।',
    },
    {
      q: 'English-এ ‘বই’-এর সঠিক অনুবাদ কোনটি?',
      options: ['Pen', 'Book', 'Table', 'School'],
      ans: 1,
      explanation: 'বইয়ের ইংরেজি প্রতিশব্দ Book।',
    },
  ],
  6: [
    {
      q: 'বাংলা ভাষার মূল বর্ণ কয়টি?',
      options: ['৪৯টি', '৫০টি', '৫১টি', '৫২টি'],
      ans: 1,
      explanation: 'বাংলা বর্ণমালায় ১১টি স্বরবর্ণ এবং ৩৯টি ব্যঞ্জনবর্ণ নিয়ে মোট ৫০টি বর্ণ রয়েছে।',
    },
    {
      q: '১২ × ৫ = কত?',
      options: ['৫০', '৬০', '৭০', '৮০'],
      ans: 1,
      explanation: '১২ কে ৫ দিয়ে গুণ করলে ৬০ পাওয়া যায়।',
    },
    {
      q: 'বাংলাদেশের জাতীয় ফুল কোনটি?',
      options: ['গোলাপ', 'সাদা শাপলা', 'জবা', 'বেলি'],
      ans: 1,
      explanation: 'বাংলাদেশের জাতীয় ফুল হলো সাদা শাপলা (Nymphaea nouchali)।',
    },
    {
      q: '‘Water’-এর সঠিক বাংলা অর্থ কোনটি?',
      options: ['আগুন', 'বায়ু', 'পানি', 'মাটি'],
      ans: 2,
      explanation: 'Water মানে পানি বা জল।',
    },
    {
      q: 'পৃথিবীর একমাত্র প্রাকৃতিক উপগ্রহ কোনটি?',
      options: ['সূর্য', 'চাঁদ', 'মঙ্গল', 'শুক্র'],
      ans: 1,
      explanation: 'চাঁদ হলো পৃথিবীর একমাত্র প্রাকৃতিক উপগ্রহ।',
    },
  ],
  7: [
    {
      q: '‘সততা’ শব্দের বিপরীত শব্দ কোনটি?',
      options: ['ন্যায়', 'অসততা', 'সত্য', 'শান্তি'],
      ans: 1,
      explanation: 'সততার বিপরীত শব্দ অসততা।',
    },
    {
      q: '১৫ × ৪ = কত?',
      options: ['৫০', '৬০', '৭০', '৮০'],
      ans: 1,
      explanation: '১৫ এর ৪ গুণ হলো ৬০।',
    },
    {
      q: 'বাংলাদেশের স্বাধীনতা দিবস কবে পালিত হয়?',
      options: ['২১ ফেব্রুয়ারি', '২৬ মার্চ', '১৬ ডিসেম্বর', '১৪ এপ্রিল'],
      ans: 1,
      explanation: '২৬ মার্চ বাংলাদেশের মহান স্বাধীনতা ও জাতীয় দিবস।',
    },
    {
      q: 'উদ্ভিদ খাদ্য তৈরি করে কোন জৈব রাসায়নিক প্রক্রিয়ায়?',
      options: ['শ্বসন', 'সালোকসংশ্লেষণ', 'পরিপাক', 'বাষ্পীভবন'],
      ans: 1,
      explanation: 'সূর্যালোকের উপস্থিতিতে ক্লোরোফিলের সাহায্যে সালোকসংশ্লেষণ প্রক্রিয়ায় খাদ্য তৈরি করে।',
    },
    {
      q: 'Past tense of "go" is —',
      options: ['goed', 'gone', 'went', 'going'],
      ans: 2,
      explanation: 'Go ক্রিয়াপদের past form হলো Went (Go - Went - Gone)।',
    },
  ],
  8: [
    {
      q: '‘আকাশ’ শব্দের সঠিক সমার্থক শব্দ কোনটি?',
      options: ['গগন', 'পাহাড়', 'সাগর', 'মেদিনী'],
      ans: 0,
      explanation: 'আকাশের সমার্থক শব্দসমূহ: গগন, অম্বর, নভঃ, ব্যোম ইত্যাদি।',
    },
    {
      q: '√৬৪ (Square root of 64) = কত?',
      options: ['৬', '৭', '৮', '৯'],
      ans: 2,
      explanation: '৮ × ৮ = ৬৪, তাই ৬৪ এর বর্গমূল হলো ৮।',
    },
    {
      q: 'বাংলাদেশের জাতীয় কবি কে?',
      options: ['রবীন্দ্রনাথ ঠাকুর', 'কাজী নজরুল ইসলাম', 'জসীমউদ্দীন', 'শামসুর রাহমান'],
      ans: 1,
      explanation: 'বিদ্রোহী কবি কাজী নজরুল ইসলাম বাংলাদেশের জাতীয় কবি।',
    },
    {
      q: 'মানবদেহে রক্ত পাম্প করার প্রধান অঙ্গ কোনটি?',
      options: ['ফুসফুস', 'হৃদপিণ্ড', 'কিডনি', 'যকৃত'],
      ans: 1,
      explanation: 'হৃদপিণ্ড (Heart) পেশিবহুল অঙ্গ যা সারা দেহে নিরবচ্ছিন্ন রক্ত পাম্প করে।',
    },
    {
      q: 'Opposite of "Honest" is —',
      options: ['Kind', 'Brave', 'Dishonest', 'Happy'],
      ans: 2,
      explanation: 'Honest (সৎ)-এর বিপরীত শব্দ Dishonest (অসৎ)।',
    },
  ],
  9: [
    {
      q: '‘অমর’ শব্দের সঠিক বিপরীতার্থক শব্দ কোনটি?',
      options: ['চিরস্থায়ী', 'মরণশীল', 'অক্ষয়', 'স্থায়ী'],
      ans: 1,
      explanation: 'অমর (যার মৃত্যু নেই)-এর বিপরীত মরণশীল (যা নশ্বর)।',
    },
    {
      q: '2x + 5 = 15 হলে, x-এর মান কত?',
      options: ['৩', '৪', '৫', '৬'],
      ans: 2,
      explanation: '2x = 15 - 5 = 10, অতএব x = 10 / 2 = 5।',
    },
    {
      q: 'বাংলাদেশ চূড়ান্ত বিজয় অর্জন করে কোন তারিখে?',
      options: ['২৬ মার্চ', '২১ ফেব্রুয়ারি', '১৬ ডিসেম্বর', '১৫ আগস্ট'],
      ans: 2,
      explanation: '১৯৭১ সালের ১৬ ডিসেম্বর পাকবাহিনীর আত্মসমর্পণের মাধ্যমে বিজয় অর্জিত হয়।',
    },
    {
      q: 'অক্সিজেন গ্যাসের রাসায়নিক সংকেত কোনটি?',
      options: ['O', 'O2', 'CO2', 'H2'],
      ans: 1,
      explanation: 'অক্সিজেন দ্বি-পরমাণুক গ্যাস, তাই এর আণবিক সংকেত O2।',
    },
    {
      q: 'Synonym of "Big" is —',
      options: ['Small', 'Large', 'Short', 'Thin'],
      ans: 1,
      explanation: 'Big এবং Large দুটি শব্দের অর্থই বৃহৎ বা বড়।',
    },
  ],
  10: [
    {
      q: '‘নির্ভীক’ শব্দের সঠিক অর্থ কী?',
      options: ['ভীতু', 'সাহসী', 'দুর্বল', 'অলস'],
      ans: 1,
      explanation: 'নির্ভীক শব্দের অর্থ ভয়হীন বা অত্যন্ত সাহসী।',
    },
    {
      q: 'x² = 49 হলে, x-এর ধনাত্মক মান কত?',
      options: ['৫', '৬', '৭', '৮'],
      ans: 2,
      explanation: '৭ এর বর্গ ৪৯ (৭ × ৭ = ৪৯), তাই ধনাত্মক মান ৭।',
    },
    {
      q: 'জাতীয় স্মৃতিসৌধ কোথায় অবস্থিত?',
      options: ['ঢাকা সদর', 'সাভার, ঢাকা', 'চট্টগ্রাম', 'রাজশাহী'],
      ans: 1,
      explanation: 'জাতীয় স্মৃতিসৌধ ঢাকার সাভারে অবস্থিত। স্থপতি সৈয়দ মাইনুল হোসেন।',
    },
    {
      q: 'বিশুদ্ধ পানির রাসায়নিক সংকেত কোনটি?',
      options: ['CO2', 'H2O', 'NaCl', 'HCl'],
      ans: 1,
      explanation: 'পানির রাসায়নিক সংকেত H2O (২টি হাইড্রোজেন ও ১টি অক্সিজেন পরমাণু)।',
    },
    {
      q: 'Choose the grammatically correct sentence:',
      options: ['He go to school.', 'He goes to school.', 'He going school.', 'He gone school.'],
      ans: 1,
      explanation: 'Third person singular number (He)-এর পর present indefinite-এ verb-এর সাথে s/es যুক্ত হয়।',
    },
  ],
};

// 💎 Class-wise Paid/Premium Model Test Questions (Full comprehensive tests, 10 questions each)
export const PAID_CLASS_QUESTIONS: Record<number, RawQuestion[]> = {
  5: [
    ...FREE_CLASS_QUESTIONS[5],
    {
      q: '‘বিদ্রোহী’ কবিতার রচয়িতা কে?',
      options: ['কাজী নজরুল ইসলাম', 'রবীন্দ্রনাথ ঠাকুর', 'জসীমউদ্দীন', 'সুকান্ত ভট্টাচার্য'],
      ans: 0,
      explanation: 'কাজী নজরুল ইসলাম ১৯২১ সালে যুগান্তকারী ‘বিদ্রোহী’ কবিতা রচনা করেন।',
    },
    {
      q: 'বৃত্তের কেন্দ্রের মধ্য দিয়ে অতিক্রান্ত জ্যা-কে কী বলা হয়?',
      options: ['ব্যাসার্ধ', 'পরিধি', 'ব্যাস', 'চাপ'],
      ans: 2,
      explanation: 'বৃত্তের কেন্দ্রগামী জ্যা-কে ব্যাস বলা হয়, যা বৃত্তের বৃহত্তম জ্যা।',
    },
    {
      q: 'সবচেয়ে দ্রুতগামী স্থলচর প্রাণী কোনটি?',
      options: ['বাঘ', 'চিতাবাঘ', 'ঘোড়া', 'হরিণ'],
      ans: 1,
      explanation: 'চিতাবাঘ (Cheetah) ঘণ্টায় প্রায় ১১২ কিমি বেগে দৌড়াতে পারে।',
    },
    {
      q: 'Plural form of "Child" is —',
      options: ['Childs', 'Children', 'Childrens', 'Childes'],
      ans: 1,
      explanation: 'Child-এর irregular plural form হলো Children।',
    },
    {
      q: 'কম্পিউটারের মস্তিষ্ক কাকে বলা হয়?',
      options: ['Monitor', 'RAM', 'CPU', 'Hard Disk'],
      ans: 2,
      explanation: 'CPU (Central Processing Unit) কম্পিউটারের সকল নির্দেশ ও হিসাব সম্পন্ন করে।',
    },
  ],
  6: [
    ...FREE_CLASS_QUESTIONS[6],
    {
      q: '‘চর্যাপদ’ কোন যুগে রচিত হয়েছিল?',
      options: ['প্রাচীন যুগ', 'মধ্যযুগ', 'আধুনিক যুগ', 'উপনিবেশিক যুগ'],
      ans: 0,
      explanation: 'চর্যাপদ বাংলা সাহিত্যের প্রাচীনতম নিদর্শন (আনুমানিক ৭ম-১২শ শতক)।',
    },
    {
      q: 'লসাগু ও গসাগু এর ক্ষেত্রে: দুটি সংখ্যার গুণফল = ?',
      options: ['লসাগু + গসাগু', 'লসাগু × গসাগু', 'লসাগু ÷ গসাগু', 'লসাগু - গসাগু'],
      ans: 1,
      explanation: 'দুটি সংখ্যার গুণফল = তাদের লসাগু × তাদের গসাগু।',
    },
    {
      q: 'আলোর গতিবেগ প্রতি সেকেন্ডে প্রায় কত?',
      options: ['১ লক্ষ কিমি', '২ লক্ষ কিমি', '৩ লক্ষ কিমি', '৪ লক্ষ কিমি'],
      ans: 2,
      explanation: 'শূন্যস্থানে আলোর বেগ প্রতি সেকেন্ডে প্রায় ৩,০০,০০০ কিলোমিটার (3×10⁸ m/s)।',
    },
    {
      q: 'What is the opposite word of "Ancient"?',
      options: ['Old', 'Modern', 'Historic', 'Past'],
      ans: 1,
      explanation: 'Ancient (প্রাচীন)-এর বিপরীত Modern (আধুনিক)।',
    },
    {
      q: 'কোনটি ইনপুট ডিভাইস?',
      options: ['Monitor', 'Printer', 'Keyboard', 'Speaker'],
      ans: 2,
      explanation: 'কিবোর্ড দ্বারা কম্পিউটারে তথ্য ইনপুট দেওয়া হয়।',
    },
  ],
  7: [
    ...FREE_CLASS_QUESTIONS[7],
    {
      q: 'বাংলা ব্যাকরণের প্রধান আলোচ্য বিষয় কয়টি?',
      options: ['২টি', '৩টি', '৪টি', '৫টি'],
      ans: 2,
      explanation: 'বাংলা ব্যাকরণের আলোচ্য বিষয় চারটি: ধ্বনিতত্ত্ব, রূপতত্ত্ব, বাক্যতত্ত্ব ও অর্থতত্ত্ব।',
    },
    {
      q: 'ত্রিভুজের তিন কোণের সমষ্টি কত ডিগ্রি?',
      options: ['৯০°', '১৮০°', '২৭০°', '৩৬০°'],
      ans: 1,
      explanation: 'যে কোনো সমতল ত্রিভুজের তিন কোণের সমষ্টি ১৮০ ডিগ্রি বা দুই সমকোণ।',
    },
    {
      q: 'কোন ভিটামিনের অভাবে স্কার্ভি (Scurvy) রোগ হয়?',
      options: ['ভিটামিন A', 'ভিটামিন B', 'ভিটামিন C', 'ভিটামিন D'],
      ans: 2,
      explanation: 'ভিটামিন সি (Ascorbic acid)-এর অভাবে মাড়ি ফুলে রক্ত পড়া বা স্কার্ভি হয়।',
    },
    {
      q: 'She is good _____ English.',
      options: ['in', 'at', 'with', 'on'],
      ans: 1,
      explanation: 'কোনো বিষয়ে পারদর্শিতা বোঝাতে "good at" appropriate preposition বসে।',
    },
    {
      q: 'ROM-এর পূর্ণরূপ কী?',
      options: ['Read Only Memory', 'Random Only Memory', 'Rapid Output Memory', 'Read Output Mode'],
      ans: 0,
      explanation: 'ROM = Read Only Memory, যা কম্পিউটারের স্থায়ী মেমরি।',
    },
  ],
  8: [
    ...FREE_CLASS_QUESTIONS[8],
    {
      q: '‘সঞ্চয়িতা’ কাব্যগ্রন্থটি কার লেখা?',
      options: ['কাজী নজরুল ইসলাম', 'রবীন্দ্রনাথ ঠাকুর', 'জীবনানন্দ দাশ', 'মাইকেল মধুসূদন দত্ত'],
      ans: 1,
      explanation: 'রবীন্দ্রনাথ ঠাকুরের সেরা কবিতাগুলোর সংকলন হলো ‘সঞ্চয়িতা’।',
    },
    {
      q: '(a + b)² - (a - b)² = কত?',
      options: ['2ab', '4ab', '2(a² + b²)', 'a² + b²'],
      ans: 1,
      explanation: 'বীজগণিতের সূত্রানুসারে (a + b)² - (a - b)² = 4ab।',
    },
    {
      q: 'বিদ্যুৎ পরিবাহী ধাতু কোনটি সবচেয়ে উৎকৃষ্ট?',
      options: ['লোহা', 'তামা', 'রূপা', 'অ্যালুমিনিয়াম'],
      ans: 2,
      explanation: 'ধাতুসমূহের মধ্যে রূপা (Silver)-এর বিদ্যুৎ পরিবাহিতা সবচেয়ে বেশি।',
    },
    {
      q: 'Identify the noun in: "Honesty is the best policy."',
      options: ['Best', 'Honesty', 'Is', 'The'],
      ans: 1,
      explanation: 'Honesty হলো Abstract Noun।',
    },
    {
      q: 'ই-মেইল (Email) উদ্ভাবক কে?',
      options: ['বিল গেটস', 'রে টমলিনসন', 'স্টিভ জবস', 'মার্ক জুকারবার্গ'],
      ans: 1,
      explanation: '১৯৭১ সালে রে টমলিনসন প্রথম নেটওয়ার্ক ই-মেইল প্রেরণ করেন।',
    },
  ],
  9: [
    ...FREE_CLASS_QUESTIONS[9],
    {
      q: '‘লালসালু’ উপন্যাসের রচয়িতা কে?',
      options: ['সৈয়দ ওয়ালীউল্লাহ্', 'শরৎচন্দ্র চট্টোপাধ্যায়', 'মানিক বন্দ্যোপাধ্যায়', 'তারাশঙ্কর বন্দ্যোপাধ্যায়'],
      ans: 0,
      explanation: 'সৈয়দ ওয়ালীউল্লাহ্ ১৯৪৮ সালে বিখ্যাত সামাজিক উপন্যাস ‘লালসালু’ রচনা করেন।',
    },
    {
      q: 'sin²θ + cos²θ = কত?',
      options: ['0', '1', '-1', '2'],
      ans: 1,
      explanation: 'ত্রিকোণমিতিক অভেদ অনুযায়ী সর্বদা sin²θ + cos²θ = 1।',
    },
    {
      q: 'নিউটনের গতির দ্বিতীয় সূত্র থেকে কিসের পরিমাপ পাওয়া যায়?',
      options: ['বেগ', 'ত্বরণ', 'বল (Force)', 'ভর'],
      ans: 2,
      explanation: 'নিউটনের দ্বিতীয় সূত্র F = ma থেকে প্রযুক্ত বলের পরিমাপ ও সমীকরণ পাওয়া যায়।',
    },
    {
      q: 'What is the synonym of "Obdurate"?',
      options: ['Stubborn', 'Soft', 'Flexible', 'Kind'],
      ans: 0,
      explanation: 'Obdurate অর্থ অনমনীয় বা একগুঁয়ে (Stubborn/Rigid)।',
    },
    {
      q: 'IP Address-এর পূর্ণরূপ কী?',
      options: ['Internal Protocol', 'Internet Protocol', 'Instant Packet', 'Inter Process'],
      ans: 1,
      explanation: 'IP = Internet Protocol, ইন্টারনেটে সংযুক্ত যন্ত্রের পরিচয় সংখ্যা।',
    },
  ],
  10: [
    ...FREE_CLASS_QUESTIONS[10],
    {
      q: '‘বাংলা সাহিত্যের ইতিবৃত্ত’ গ্রন্থের রচয়িতা কে?',
      options: ['ড. মুহম্মদ শহীদুল্লাহ্', 'ড. সুকুমার সেন', 'ড. অসিতকুমার বন্দ্যোপাধ্যায়', 'ড. সুনীতিকুমার চট্টোপাধ্যায়'],
      ans: 0,
      explanation: 'ড. মুহম্মদ শহীদুল্লাহ্ প্রাচীন ও মধ্যযুগের প্রামাণ্য ইতিহাস তুলে ধরেন।',
    },
    {
      q: 'কোনো সমকোণী ত্রিভুজের অতিভুজ ১০ এবং ভূমি ৮ হলে, লম্ব কত?',
      options: ['৫', '৬', '৭', '৮'],
      ans: 1,
      explanation: 'পীথাগোরাসের সূত্র: লম্ব² = ১০² - ৮² = ১০০ - ৬৪ = ৩৬, অতএব লম্ব = ৬।',
    },
    {
      q: 'ক্লোরিনের পারমাণবিক সংখ্যা কত?',
      options: ['১৫', '১৬', '১৭', '১৮'],
      ans: 2,
      explanation: 'পর্যায় সারণিতে ১৭ নং গ্রুপের হ্যালোজেন মৌল ক্লোরিন (Cl)-এর পারমাণবিক সংখ্যা ১৭।',
    },
    {
      q: '"Look after" phrase-এর সঠিক অর্থ কী?',
      options: ['খোঁজা', 'যত্ন নেওয়া (Take care)', 'ঘৃণা করা', 'ভুলে যাওয়া'],
      ans: 1,
      explanation: 'Look after মানে যত্ন নেওয়া বা দেখাশোনা করা (To take care of)。',
    },
    {
      q: 'HTML-এর পূর্ণ রূপ কোনটি?',
      options: [
        'Hyper Text Markup Language',
        'High Tech Modern Language',
        'Hyperlink Text Management List',
        'Home Tool Markup Line',
      ],
      ans: 0,
      explanation: 'HTML = Hyper Text Markup Language, ওয়েবপেজের মূল কাঠামো তৈরিতে ব্যবহৃত হয়।',
    },
  ],
};

// 📚 Subject-wise Questions Data
export const SUBJECT_LIST = [
  { name: 'বাংলা', icon: '📖', color: 'from-rose-500 to-red-600' },
  { name: 'ইংরেজি', icon: '🔤', color: 'from-blue-500 to-indigo-600' },
  { name: 'গণিত', icon: '➗', color: 'from-emerald-500 to-teal-600' },
  { name: 'বিজ্ঞান', icon: '🔬', color: 'from-purple-500 to-violet-600' },
  { name: 'বাংলাদেশ ও বিশ্বপরিচয়', icon: '🌍', color: 'from-amber-500 to-orange-600' },
  { name: 'ICT', icon: '💻', color: 'from-cyan-500 to-blue-600' },
];

export const SUBJECT_QUESTIONS: Record<string, RawQuestion[]> = {
  বাংলা: [
    {
      q: 'বাংলা বর্ণমালায় স্বরবর্ণ কয়টি?',
      options: ['৯টি', '১১টি', '১২টি', '১০টি'],
      ans: 1,
      explanation: 'বাংলা বর্ণমালায় মোট ১১টি স্বরবর্ণ রয়েছে।',
    },
    {
      q: '‘বিদ্রোহী’ কবিতার কবি কে?',
      options: ['কাজী নজরুল ইসলাম', 'রবীন্দ্রনাথ ঠাকুর', 'জসীমউদ্দীন', 'সুকান্ত ভট্টাচার্য'],
      ans: 0,
      explanation: 'কাজী নজরুল ইসলাম রচিত বিদ্রোহী কবিতাটি অত্যন্ত বিখ্যাত।',
    },
    {
      q: '‘আকাশ’ শব্দের সমার্থক শব্দ কোনটি?',
      options: ['গগন', 'পাহাড়', 'সাগর', 'মেদিনী'],
      ans: 0,
      explanation: 'আকাশ = গগন, অম্বর, ব্যোম।',
    },
    {
      q: '‘সততা’ শব্দের বিপরীত শব্দ কোনটি?',
      options: ['ন্যায়', 'অসততা', 'সত্য', 'শান্তি'],
      ans: 1,
      explanation: 'সততার বিপরীত অসততা।',
    },
    {
      q: 'বাংলা ভাষার মূল বর্ণ কয়টি?',
      options: ['৪৯টি', '৫০টি', '৫১টি', '৫২টি'],
      ans: 1,
      explanation: '১১টি স্বরবর্ণ + ৩৯টি ব্যঞ্জনবর্ণ = ৫০টি বর্ণ।',
    },
  ],
  ইংরেজি: [
    {
      q: 'Opposite of "Good" is —',
      options: ['Bad', 'Best', 'Fine', 'Nice'],
      ans: 0,
      explanation: 'Good-এর বিপরীত Bad।',
    },
    {
      q: 'Past tense of "go" is —',
      options: ['goed', 'gone', 'went', 'going'],
      ans: 2,
      explanation: 'Go -> Went -> Gone।',
    },
    {
      q: 'Plural form of "Child" is —',
      options: ['Childs', 'Children', 'Childrens', 'Childes'],
      ans: 1,
      explanation: 'Child-এর plural Children।',
    },
    {
      q: 'She is good _____ English.',
      options: ['in', 'at', 'with', 'on'],
      ans: 1,
      explanation: 'কোনো বিষয়ে পারদর্শিতায় "good at" ব্যবহৃত হয়।',
    },
    {
      q: 'Synonym of "Big" is —',
      options: ['Small', 'Large', 'Short', 'Thin'],
      ans: 1,
      explanation: 'Big এবং Large অর্থ বড়।',
    },
  ],
  গণিত: [
    {
      q: '৫ × ৬ = কত?',
      options: ['২৫', '৩০', '৩৫', '৪০'],
      ans: 1,
      explanation: '৫ × ৬ = ৩০।',
    },
    {
      q: '√৬৪ = কত?',
      options: ['৬', '৭', '৮', '৯'],
      ans: 2,
      explanation: '৮ × ৮ = ৬৪।',
    },
    {
      q: '2x + 5 = 15 হলে, x = ?',
      options: ['৩', '৪', '৫', '৬'],
      ans: 2,
      explanation: '2x = 10 -> x = 5।',
    },
    {
      q: 'ত্রিভুজের তিন কোণের সমষ্টি কত?',
      options: ['৯০°', '১৮০°', '২৭০°', '৩৬০°'],
      ans: 1,
      explanation: 'যেকোনো ত্রিভুজের তিন কোণের যোগফল ১৮০ ডিগ্রি।',
    },
    {
      q: 'x² = 49 হলে, x-এর মান কত?',
      options: ['৫', '৬', '৭', '৮'],
      ans: 2,
      explanation: '৭² = ৪৯।',
    },
  ],
  বিজ্ঞান: [
    {
      q: 'পানির রাসায়নিক সংকেত কোনটি?',
      options: ['CO2', 'H2O', 'NaCl', 'O2'],
      ans: 1,
      explanation: 'পানি = H2O।',
    },
    {
      q: 'উদ্ভিদ খাদ্য তৈরি করে কোন প্রক্রিয়ায়?',
      options: ['শ্বসন', 'সালোকসংশ্লেষণ', 'পরিপাক', 'বাষ্পীভবন'],
      ans: 1,
      explanation: 'সালোকসংশ্লেষণ প্রক্রিয়ায় ক্লোরোফিলের মাধ্যমে খাদ্য তৈরি করে।',
    },
    {
      q: 'মানবদেহে রক্ত পাম্প করার প্রধান অঙ্গ কোনটি?',
      options: ['ফুসফুস', 'হৃদপিণ্ড', 'কিডনি', 'যকৃত'],
      ans: 1,
      explanation: 'হৃদপিণ্ড রক্ত সঞ্চালনে সহায়তা করে।',
    },
    {
      q: 'অক্সিজেনের সংকেত কোনটি?',
      options: ['O', 'O2', 'CO2', 'H2'],
      ans: 1,
      explanation: 'অক্সিজেন গ্যাস O2।',
    },
    {
      q: 'কোন ভিটামিনের অভাবে স্কার্ভি রোগ হয়?',
      options: ['ভিটামিন A', 'ভিটামিন B', 'ভিটামিন C', 'ভিটামিন D'],
      ans: 2,
      explanation: 'ভিটামিন C-এর অভাবে স্কার্ভি হয়।',
    },
  ],
  'বাংলাদেশ ও বিশ্বপরিচয়': [
    {
      q: 'বাংলাদেশের রাজধানী কোনটি?',
      options: ['চট্টগ্রাম', 'ঢাকা', 'খুলনা', 'রাজশাহী'],
      ans: 1,
      explanation: 'বাংলাদেশের রাজধানী ঢাকা।',
    },
    {
      q: 'বাংলাদেশের স্বাধীনতা দিবস কবে?',
      options: ['২১ ফেব্রুয়ারি', '২৬ মার্চ', '১৬ ডিসেম্বর', '১৪ এপ্রিল'],
      ans: 1,
      explanation: '২৬ মার্চ মহান স্বাধীনতা দিবস।',
    },
    {
      q: 'বাংলাদেশের বিজয় দিবস কবে?',
      options: ['২৬ মার্চ', '২১ ফেব্রুয়ারি', '১৬ ডিসেম্বর', '১৫ আগস্ট'],
      ans: 2,
      explanation: '১৬ ডিসেম্বর মহান বিজয় দিবস।',
    },
    {
      q: 'জাতীয় স্মৃতিসৌধ কোথায় অবস্থিত?',
      options: ['ঢাকা সদর', 'সাভার', 'চট্টগ্রাম', 'কুমিল্লা'],
      ans: 1,
      explanation: 'জাতীয় স্মৃতিসৌধ সাভারে অবস্থিত।',
    },
    {
      q: 'বাংলাদেশের জাতীয় ফুল কোনটি?',
      options: ['গোলাপ', 'সাদা শাপলা', 'জবা', 'বেলি'],
      ans: 1,
      explanation: 'সাদা শাপলা জাতীয় ফুল।',
    },
  ],
  ICT: [
    {
      q: 'কম্পিউটারের মস্তিষ্ক কাকে বলা হয়?',
      options: ['Monitor', 'RAM', 'CPU', 'Hard Disk'],
      ans: 2,
      explanation: 'CPU (Central Processing Unit) কম্পিউটারের মস্তিষ্ক।',
    },
    {
      q: 'কোনটি ইনপুট ডিভাইস?',
      options: ['Monitor', 'Printer', 'Keyboard', 'Speaker'],
      ans: 2,
      explanation: 'কিবোর্ড একটি ইনপুট ডিভাইস।',
    },
    {
      q: 'ROM-এর পূর্ণরূপ কী?',
      options: ['Read Only Memory', 'Random Only Memory', 'Rapid Output Memory', 'Read Output Mode'],
      ans: 0,
      explanation: 'ROM = Read Only Memory।',
    },
    {
      q: 'IP Address-এর পূর্ণরূপ কী?',
      options: ['Internal Protocol', 'Internet Protocol', 'Instant Packet', 'Inter Process'],
      ans: 1,
      explanation: 'IP = Internet Protocol।',
    },
    {
      q: 'HTML-এর পূর্ণরূপ কী?',
      options: [
        'Hyper Text Markup Language',
        'High Tech Modern Language',
        'Hyperlink Text Management List',
        'Home Tool Markup Line',
      ],
      ans: 0,
      explanation: 'HTML = Hyper Text Markup Language।',
    },
  ],
};

// ─── HELPER FUNCTIONS FOR RETRIEVAL & ADMIN STORAGE ───

export const toBengaliClass = (cls: number | string): string => {
  const map: Record<string, string> = {
    '5': '৫ম',
    '6': '৬ষ্ঠ',
    '7': '৭ম',
    '8': '৮ম',
    '9': '৯ম',
    '10': '১০ম',
  };
  return map[String(cls)] || `${cls}ম`;
};

export const toBengaliNumber = (num: number | string): string => {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/\d/g, (d) => bnDigits[Number(d)]);
};

export function getStoredFreeQuestions(classGrade: number): RawQuestion[] {
  if (typeof window === 'undefined') {
    return FREE_CLASS_QUESTIONS[classGrade] || [];
  }
  try {
    const raw = localStorage.getItem(`sn_free_q_${classGrade}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return FREE_CLASS_QUESTIONS[classGrade] || [];
}

export function saveStoredFreeQuestions(classGrade: number, questions: RawQuestion[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`sn_free_q_${classGrade}`, JSON.stringify(questions));
  } catch {}
}

export function getStoredPaidQuestions(classGrade: number): RawQuestion[] {
  if (typeof window === 'undefined') {
    return PAID_CLASS_QUESTIONS[classGrade] || [];
  }
  try {
    const raw = localStorage.getItem(`sn_paid_q_${classGrade}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return PAID_CLASS_QUESTIONS[classGrade] || [];
}

export function saveStoredPaidQuestions(classGrade: number, questions: RawQuestion[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`sn_paid_q_${classGrade}`, JSON.stringify(questions));
  } catch {}
}

export function getStoredSubjectQuestions(classGrade: number, subject: string): RawQuestion[] {
  if (typeof window === 'undefined') {
    return SUBJECT_QUESTIONS[subject] || [];
  }
  try {
    const raw = localStorage.getItem(`sn_sub_q_${classGrade}_${subject}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return SUBJECT_QUESTIONS[subject] || [];
}

export function saveStoredSubjectQuestions(
  classGrade: number,
  subject: string,
  questions: RawQuestion[]
): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`sn_sub_q_${classGrade}_${subject}`, JSON.stringify(questions));
  } catch {}
}

// ─── 💎 Paid Quiz Price Settings Structure ───
export interface QuizPrices {
  classPrices: Record<number, number>; // e.g. 5: 50, 6: 50, 7: 50, 8: 50, 9: 50, 10: 50
  subjectPrice: number; // e.g. 50
  packages: {
    singleSubject: number; // e.g. 50
    fullClass: number; // e.g. 150
    vipAll: number; // e.g. 200
  };
}

export const DEFAULT_QUIZ_PRICES: QuizPrices = {
  classPrices: {
    5: 50,
    6: 50,
    7: 50,
    8: 50,
    9: 50,
    10: 50,
  },
  subjectPrice: 50,
  packages: {
    singleSubject: 50,
    fullClass: 150,
    vipAll: 200,
  },
};

export function getStoredQuizPrices(): QuizPrices {
  if (typeof window === 'undefined') return DEFAULT_QUIZ_PRICES;
  try {
    const raw = localStorage.getItem('sn_quiz_prices_v1');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return {
          classPrices: { ...DEFAULT_QUIZ_PRICES.classPrices, ...(parsed.classPrices || {}) },
          subjectPrice: Number(parsed.subjectPrice) || 50,
          packages: {
            singleSubject: Number(parsed.packages?.singleSubject) || 50,
            fullClass: Number(parsed.packages?.fullClass) || 150,
            vipAll: Number(parsed.packages?.vipAll) || 200,
          },
        };
      }
    }
  } catch {}
  return DEFAULT_QUIZ_PRICES;
}

export function saveStoredQuizPrices(prices: QuizPrices): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('sn_quiz_prices_v1', JSON.stringify(prices));
  } catch {}
}


