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

// 📚 Subject-wise Questions Data & Group Structures
export type AcademicGroup = 'science' | 'humanities' | 'commerce' | 'compulsory';

export interface QuizSubjectItem {
  name: string;
  icon: string;
  color: string;
  group?: AcademicGroup;
}

export const COMPULSORY_SUBJECTS_9_10: QuizSubjectItem[] = [
  { name: 'বাংলা ১ম পত্র', icon: '📖', color: 'from-rose-500 to-red-600', group: 'compulsory' },
  { name: 'বাংলা ২য় পত্র', icon: '📝', color: 'from-amber-500 to-rose-600', group: 'compulsory' },
  { name: 'ইংরেজি ১ম পত্র', icon: '🔤', color: 'from-blue-500 to-indigo-600', group: 'compulsory' },
  { name: 'ইংরেজি ২য় পত্র', icon: '✍️', color: 'from-cyan-500 to-sky-600', group: 'compulsory' },
  { name: 'সাধারণ গণিত', icon: '➗', color: 'from-emerald-500 to-teal-600', group: 'compulsory' },
  { name: 'তথ্য ও যোগাযোগ প্রযুক্তি (ICT)', icon: '💻', color: 'from-cyan-500 to-blue-600', group: 'compulsory' },
  { name: 'ইসলাম ও নৈতিক শিক্ষা', icon: '🕌', color: 'from-emerald-600 to-green-700', group: 'compulsory' },
  { name: 'হিন্দুধর্ম ও নৈতিক শিক্ষা', icon: '🛕', color: 'from-amber-600 to-orange-700', group: 'compulsory' },
];

export const SCIENCE_SUBJECTS_9_10: QuizSubjectItem[] = [
  { name: 'পদার্থবিজ্ঞান', icon: '⚛️', color: 'from-sky-500 to-blue-700', group: 'science' },
  { name: 'রসায়ন', icon: '🧪', color: 'from-emerald-500 to-teal-700', group: 'science' },
  { name: 'জীববিজ্ঞান', icon: '🧬', color: 'from-green-500 to-emerald-700', group: 'science' },
  { name: 'উচ্চতর গণিত', icon: '📐', color: 'from-indigo-500 to-purple-700', group: 'science' },
  { name: 'বাংলাদেশ ও বিশ্বপরিচয়', icon: '🌍', color: 'from-amber-500 to-orange-600', group: 'science' },
];

export const HUMANITIES_SUBJECTS_9_10: QuizSubjectItem[] = [
  { name: 'বাংলাদেশের ইতিহাস ও বিশ্বসভ্যতা', icon: '🏛️', color: 'from-amber-600 to-yellow-800', group: 'humanities' },
  { name: 'ভূগোল ও পরিবেশ', icon: '🗺️', color: 'from-teal-500 to-emerald-700', group: 'humanities' },
  { name: 'পৌরনীতি ও নাগরিকতা', icon: '⚖️', color: 'from-rose-500 to-red-700', group: 'humanities' },
  { name: 'অর্থনীতি', icon: '📈', color: 'from-blue-500 to-cyan-700', group: 'humanities' },
  { name: 'সাধারণ বিজ্ঞান', icon: '🔬', color: 'from-purple-500 to-violet-700', group: 'humanities' },
];

export const COMMERCE_SUBJECTS_9_10: QuizSubjectItem[] = [
  { name: 'হিসাববিজ্ঞান', icon: '📊', color: 'from-emerald-600 to-teal-800', group: 'commerce' },
  { name: 'ব্যবসায় উদ্যোগ', icon: '🏢', color: 'from-indigo-600 to-blue-800', group: 'commerce' },
  { name: 'ফিন্যান্স ও ব্যাংকিং', icon: '🏦', color: 'from-cyan-600 to-sky-800', group: 'commerce' },
  { name: 'সাধারণ বিজ্ঞান', icon: '🔬', color: 'from-purple-500 to-violet-700', group: 'commerce' },
];

export const JUNIOR_SUBJECTS_5_8: QuizSubjectItem[] = [
  { name: 'বাংলা ১ম পত্র', icon: '📖', color: 'from-rose-500 to-red-600' },
  { name: 'বাংলা ২য় পত্র', icon: '📝', color: 'from-amber-500 to-rose-600' },
  { name: 'ইংরেজি ১ম পত্র', icon: '🔤', color: 'from-blue-500 to-indigo-600' },
  { name: 'ইংরেজি ২য় পত্র', icon: '✍️', color: 'from-cyan-500 to-sky-600' },
  { name: 'গণিত', icon: '➗', color: 'from-emerald-500 to-teal-600' },
  { name: 'বিজ্ঞান', icon: '🔬', color: 'from-purple-500 to-violet-600' },
  { name: 'বাংলাদেশ ও বিশ্বপরিচয়', icon: '🌍', color: 'from-amber-500 to-orange-600' },
  { name: 'ICT', icon: '💻', color: 'from-cyan-500 to-blue-600' },
  { name: 'ইসলাম ও নৈতিক শিক্ষা', icon: '🕌', color: 'from-emerald-600 to-green-700' },
  { name: 'হিন্দুধর্ম ও নৈতিক শিক্ষা', icon: '🛕', color: 'from-amber-600 to-orange-700' },
];

export function getSubjectsForClassAndGroup(
  classGrade: number,
  group?: AcademicGroup | 'all'
): QuizSubjectItem[] {
  if (classGrade <= 8) {
    if (classGrade === 5) {
      return [
        { name: 'বাংলা', icon: '📖', color: 'from-rose-500 to-red-600' },
        { name: 'ইংরেজি', icon: '🔤', color: 'from-blue-500 to-indigo-600' },
        { name: 'প্রাথমিক গণিত', icon: '➗', color: 'from-emerald-500 to-teal-600' },
        { name: 'প্রাথমিক বিজ্ঞান', icon: '🔬', color: 'from-purple-500 to-violet-600' },
        { name: 'বাংলাদেশ ও বিশ্বপরিচয়', icon: '🌍', color: 'from-amber-500 to-orange-600' },
        { name: 'ইসলাম ও নৈতিক শিক্ষা', icon: '🕌', color: 'from-emerald-600 to-green-700' },
        { name: 'হিন্দুধর্ম ও নৈতিক শিক্ষা', icon: '🛕', color: 'from-amber-600 to-orange-700' },
      ];
    }
    return JUNIOR_SUBJECTS_5_8;
  }

  // Class 9-10
  if (group === 'science') return SCIENCE_SUBJECTS_9_10;
  if (group === 'humanities') return HUMANITIES_SUBJECTS_9_10;
  if (group === 'commerce') return COMMERCE_SUBJECTS_9_10;
  if (group === 'compulsory') return COMPULSORY_SUBJECTS_9_10;

  // If 'all' or undefined, return science + humanities + commerce + compulsory combined without duplicates
  const allSubs: QuizSubjectItem[] = [
    ...SCIENCE_SUBJECTS_9_10,
    ...HUMANITIES_SUBJECTS_9_10,
    ...COMMERCE_SUBJECTS_9_10,
    ...COMPULSORY_SUBJECTS_9_10,
  ];

  const seen = new Set<string>();
  return allSubs.filter((item) => {
    if (seen.has(item.name)) return false;
    seen.add(item.name);
    return true;
  });
}

// Fallback legacy SUBJECT_LIST
export const SUBJECT_LIST = [
  ...JUNIOR_SUBJECTS_5_8,
  ...SCIENCE_SUBJECTS_9_10,
  ...HUMANITIES_SUBJECTS_9_10,
  ...COMMERCE_SUBJECTS_9_10,
].filter((v, i, a) => a.findIndex((t) => t.name === v.name) === i);

export const SUBJECT_QUESTIONS: Record<string, RawQuestion[]> = {
  'বাংলা ১ম পত্র': [
    {
      q: '‘বিদ্রোহী’ কবিতার কবি কে?',
      options: ['কাজী নজরুল ইসলাম', 'রবীন্দ্রনাথ ঠাকুর', 'জসীমউদ্দীন', 'সুকান্ত ভট্টাচার্য'],
      ans: 0,
      explanation: 'কাজী নজরুল ইসলাম রচিত ‘বিদ্রোহী’ কবিতাটি বাংলা সাহিত্যের এক অনন্য সৃষ্টি।',
    },
    {
      q: '‘সোনার তরী’ কাব্যগ্রন্থটি কার লেখা?',
      options: ['রবীন্দ্রনাথ ঠাকুর', 'জীবনানন্দ দাশ', 'মাইকেল মধুসূদন দত্ত', 'কাজী নজরুল ইসলাম'],
      ans: 0,
      explanation: '‘সোনার তরী’ বিশ্বকবি রবীন্দ্রনাথ ঠাকুরের অন্যতম শ্রেষ্ঠ কাব্যগ্রন্থ।',
    },
    {
      q: '‘লালসালু’ উপন্যাসের কেন্দ্রীয় চরিত্রের নাম কী?',
      options: ['মজিদ', 'খালেক ব্যাপারী', 'রহিমা', 'জমিলা'],
      ans: 0,
      explanation: 'সৈয়দ ওয়ালীউল্লাহ্ রচিত ‘লালসালু’ উপন্যাসের মূল চরিত্র ভণ্ড পীর মজিদ।',
    },
    {
      q: '‘কবর’ কবিতাটি কোন কবির অমর সৃষ্টি?',
      options: ['জসীমউদ্দীন', 'ফররুখ আহমদ', 'কায়কোবাদ', 'শামসুর রাহমান'],
      ans: 0,
      explanation: 'পল্লীকবি জসীমউদ্দীনের বিখ্যাত ‘কবর’ কবিতাটি ‘রাখালী’ কাব্যগ্রন্থের অন্তর্গত।',
    },
    {
      q: '‘মানুষ মুহম্মদ (স.)’ প্রবন্ধটি কার লেখা?',
      options: ['মোহাম্মদ ওয়াজেদ আলী', 'ড. মুহম্মদ শহীদুল্লাহ্', 'মুহম্মদ এনামুল হক', 'আবুল ফজল'],
      ans: 0,
      explanation: 'প্রাবন্ধিক মোহাম্মদ ওয়াজেদ আলী রচিত ‘মানুষ মুহম্মদ (স.)’ একটি বিখ্যাত জীবনীমূলক প্রবন্ধ।',
    },
  ],
  'বাংলা ২য় পত্র': [
    {
      q: 'বাংলা বর্ণমালায় মোট বর্ণ কয়টি?',
      options: ['৪৯টি', '৫০টি', '৫১টি', '৫২টি'],
      ans: 1,
      explanation: 'বাংলা বর্ণমালায় মোট ৫০টি বর্ণ রয়েছে (১১টি স্বরবর্ণ এবং ৩৯টি ব্যঞ্জনবর্ণ)।',
    },
    {
      q: '‘সততা’ শব্দটি কোন পদ?',
      options: ['বিশেষ্য', 'বিশেষণ', 'সর্বনাম', 'ক্রিয়া'],
      ans: 0,
      explanation: 'সততা হলো একটি গুণবাচক বিশেষ্য (Abstract Noun) পদ।',
    },
    {
      q: '‘সন্ধি’ শব্দের আভিধানিক অর্থ কী?',
      options: ['মিলন', 'বিচ্ছেদ', 'শব্দ তৈরি', 'ধ্বনি পরিবর্তন'],
      ans: 0,
      explanation: 'পাশাপাশি দুটি ধ্বনির পারস্পরিক মিলনকে ব্যাকরণে ‘সন্ধি’ বলা হয়।',
    },
    {
      q: '‘সূর্য’ শব্দের সমার্থক শব্দ কোনটি?',
      options: ['ভানু', 'শশী', 'অম্বু', 'মারুত'],
      ans: 0,
      explanation: 'সূর্য = ভানু, রবি, তপন, ভাস্কর, দিনমণি, দিবাকর।',
    },
    {
      q: 'বাংলা ভাষায় যোজক বা অব্যয় পদ কয়টি প্রধান ভাগে বিভক্ত?',
      options: ['৩ ভাগে', '৪ ভাগে', '৫ ভাগে', '৬ ভাগে'],
      ans: 1,
      explanation: 'বাংলা ভাষায় যোজক বা অব্যয় প্রধানত চার শ্রেণিতে বিভক্ত।',
    },
  ],
  'ইংরেজি ১ম পত্র': [
    {
      q: 'What is the synonym of the word "Courage"?',
      options: ['Bravery', 'Fear', 'Weakness', 'Cowardice'],
      ans: 0,
      explanation: 'Courage and Bravery both mean mental or moral strength to face fear.',
    },
    {
      q: 'What is the antonym of "Generous"?',
      options: ['Miserly', 'Kind', 'Helpful', 'Polite'],
      ans: 0,
      explanation: 'Generous means liberal and kind; its antonym is Miserly (stingy/narrow-minded).',
    },
    {
      q: 'The word "Delightful" means —',
      options: ['Charming', 'Sad', 'Boring', 'Painful'],
      ans: 0,
      explanation: 'Delightful refers to giving great pleasure or charm.',
    },
    {
      q: 'What is the noun form of "Beautiful"?',
      options: ['Beauty', 'Beautify', 'Beautifully', 'Beauteous'],
      ans: 0,
      explanation: 'Beauty is the noun form of the adjective Beautiful.',
    },
    {
      q: 'Choose the correct spelling:',
      options: ['Accommodation', 'Acommodation', 'Accomodation', 'Acomodation'],
      ans: 0,
      explanation: 'The correct spelling is "Accommodation" with double c and double m.',
    },
  ],
  'ইংরেজি ২য় পত্র': [
    {
      q: 'She has been living in Dhaka ______ five years.',
      options: ['for', 'since', 'from', 'in'],
      ans: 0,
      explanation: 'Period of time (সময়কাল) বোঝাতে Present Perfect Continuous Tense-এ "for" বসে।',
    },
    {
      q: 'Which one is the superlative degree of "Good"?',
      options: ['Best', 'Better', 'Goodest', 'Most good'],
      ans: 0,
      explanation: 'Degree comparison: Good (Positive) -> Better (Comparative) -> Best (Superlative).',
    },
    {
      q: 'Neither the teacher nor the students ______ present in the class.',
      options: ['were', 'was', 'is', 'has been'],
      ans: 0,
      explanation: 'In "neither...nor" structures, the verb agrees with the closer subject ("students" -> plural "were").',
    },
    {
      q: 'Identify the part of speech of the underlined word: "He runs fast."',
      options: ['Adverb', 'Adjective', 'Verb', 'Noun'],
      ans: 0,
      explanation: 'Here "fast" modifies the verb "runs", describing how he runs, so it is an Adverb.',
    },
    {
      q: 'Change the voice: "He wrote a letter."',
      options: [
        'A letter was written by him.',
        'A letter is written by him.',
        'A letter has been written by him.',
        'A letter had written by him.',
      ],
      ans: 0,
      explanation: 'Past Indefinite passive structure: Object + was/were + V3 + by + Subject.',
    },
  ],
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
  'তথ্য ও যোগাযোগ প্রযুক্তি (ICT)': [
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
  'সাধারণ গণিত': [
    {
      q: 'সকল বাস্তব সংখ্যার সেটকে কী দিয়ে প্রকাশ করা হয়?',
      options: ['N', 'Z', 'Q', 'R'],
      ans: 3,
      explanation: 'বাস্তব সংখ্যার সেটকে R (Real Number) প্রতীক দিয়ে প্রকাশ করা হয়।',
    },
    {
      q: 'সমকোণী ত্রিভুজের বৃহত্তম বাহুকে কী বলে?',
      options: ['ভূমি', 'লম্ব', 'অতিভুজ', 'উচ্চতা'],
      ans: 2,
      explanation: 'সমকোণী ত্রিভুজের সমকোণের বিপরীত বাহু তথা বৃহত্তম বাহুকে অতিভুজ বলে।',
    },
    {
      q: '(a + b)² - (a - b)² = কত?',
      options: ['2(a² + b²)', '4ab', '2ab', 'a² - b²'],
      ans: 1,
      explanation: 'বীজগণিতের সূত্রানুযায়ী (a + b)² - (a - b)² = 4ab।',
    },
    {
      q: 'বৃত্তের পরিধি ও ব্যাসের অনুপাতকে কী বলে?',
      options: ['পাই (π)', 'থিটা (θ)', 'আলফা (α)', 'বিটা (β)'],
      ans: 0,
      explanation: 'বৃত্তের পরিধি ও ব্যাসের অনুপাত একটি ধ্রুবক সংখ্যা, যাকে π (পাই) বলা হয়।',
    },
  ],
  পদার্থবিজ্ঞান: [
    {
      q: 'কাজের আন্তর্জাতিক একক (SI Unit) কোনটি?',
      options: ['নিউটন', 'প্যাসকেল', 'জুল (Joule)', 'ওয়াট'],
      ans: 2,
      explanation: 'কাজের এসআই একক হলো জুল (Joule)। বল ও সরণের গুণফল হলো কাজ।',
    },
    {
      q: 'শূন্য মাধ্যমে আলোর বেগ প্রতি সেকেন্ডে প্রায় কত?',
      options: ['৩ × ১০⁶ মিটার', '৩ × ১০⁸ মিটার', '৩ × ১০¹⁰ মিটার', '৩ × ১০⁴ মিটার'],
      ans: 1,
      explanation: 'শূন্য মাধ্যমে আলোর গতিবেগ সেকেন্ডে প্রায় ৩ × ১০⁸ মিটার (২৯৯,৭৯২,৪৫৮ মি./সে.)।',
    },
    {
      q: 'নিউটনের গতির ১ম সূত্র থেকে কোন বিষয়ের ধারণা পাওয়া যায়?',
      options: ['ত্বরণ', 'বল ও জড়তা', 'ভরবেগ', 'শক্তি'],
      ans: 1,
      explanation: 'নিউটনের ১ম সূত্র জড়তা এবং বলের গুণগত সংজ্ঞা প্রদান করে।',
    },
    {
      q: 'শব্দ তরঙ্গের প্রকারভেদ কোনটি?',
      options: ['অনুদৈর্ঘ্য তরঙ্গ', 'অনূপ্রস্থ তরঙ্গ', 'তড়িৎচৌম্বকীয় তরঙ্গ', 'আলোক তরঙ্গ'],
      ans: 0,
      explanation: 'শব্দ হলো একটি যান্ত্রিক অনুদৈর্ঘ্য (Longitudinal) তরঙ্গ যা মাধ্যমের সংকোচন ও প্রসারণের মাধ্যমে সঞ্চালিত হয়।',
    },
  ],
  রসায়ন: [
    {
      q: 'আধুনিক পর্যায় সারণির জনক কে?',
      options: ['দিমিত্রি মেন্দেলিফ', 'জন ডাল্টন', 'রাদারফোর্ড', 'হেনরি মোসলে'],
      ans: 0,
      explanation: '১৮৬৯ সালে রাশিয়ান বিজ্ঞানী দিমিত্রি মেন্দেলিফ প্রথম সফল পর্যায় সারণি তৈরি করেন।',
    },
    {
      q: 'পানির রাসায়নিক সংকেত কোনটি?',
      options: ['H₂O', 'H₂O₂', 'HO', 'H₃O'],
      ans: 0,
      explanation: 'দুটি হাইড্রোজেন ও একটি অক্সিজেন পরমাণু যুক্ত হয়ে পানি (H₂O) গঠিত হয়।',
    },
    {
      q: 'সোডিয়ামের ল্যাটিন নাম কী?',
      options: ['Kalium', 'Natrium', 'Ferrum', 'Cuprum'],
      ans: 1,
      explanation: 'সোডিয়ামের ল্যাটিন নাম হলো Natrium (Na)।',
    },
    {
      q: 'ক্ষার দ্রবণে লাল লিটমাস পেপারের বর্ণ কেমন হয়?',
      options: ['লাল', 'হলুদ', 'নীল', 'সবুজ'],
      ans: 2,
      explanation: 'ক্ষারীয় মাধ্যমে লাল লিটমাস পেপারের বর্ণ পরিবর্তিত হয়ে নীল রঙ ধারণ করে।',
    },
  ],
  জীববিজ্ঞান: [
    {
      q: 'জীবদেহের গঠন ও কাজের একককে কী বলে?',
      options: ['টিস্যু', 'কোষ (Cell)', 'অঙ্গ', 'তন্ত্র'],
      ans: 1,
      explanation: 'সকল জীবের শারীরিক গঠন ও জৈবিক ক্রিয়ার মৌলিক একক হলো কোষ।',
    },
    {
      q: 'কোষের ‘পাওয়ার হাউস’ বা শক্তিকেন্দ্র কোনটি?',
      options: ['রাইবোসোম', 'লাইসোসোম', 'মাইটোকন্ড্রিয়া', 'গলজি বডি'],
      ans: 2,
      explanation: 'শ্বসন প্রক্রিয়ায় শক্তি উৎপাদিত ও সংরক্ষিত হওয়ায় মাইটোকন্ড্রিয়াকে কোষের পাওয়ার হাউস বলা হয়।',
    },
    {
      q: 'রক্তের কোন উপাদান অক্সিজেন পরিবহনে সহায়তা করে?',
      options: ['শ্বেত রক্তকণিকা', 'অণুচক্রিকা', 'হিমোগ্লোবিন', 'রক্তরস'],
      ans: 2,
      explanation: 'লোহিত রক্তকণিকায় থাকা হিমোগ্লোবিন অক্সিজেনের সাথে যুক্ত হয়ে অক্সিহিমোগ্লোবিনরূপে সারা দেহে অক্সিজেন পৌঁছে দেয়।',
    },
    {
      q: 'উদ্ভিদের সালোকসংশ্লেষণ প্রক্রিয়ায় কোন গ্যাস নির্গত হয়?',
      options: ['কার্বন ডাই-অক্সাইড', 'অক্সিজেন (O₂)', 'নাইট্রোজেন', 'মিথেন'],
      ans: 1,
      explanation: 'সালোকসংশ্লেষণের আলোক পর্যায়ে পানি ভেঙে উপজাত হিসেবে অক্সিজেন নির্গত হয়।',
    },
  ],
  'উচ্চতর গণিত': [
    {
      q: 'স্থানাঙ্ক জ্যামিতিতে মূলবিন্দুর স্থানাঙ্ক কত?',
      options: ['(১, ১)', '(০, ০)', '(১, ০)', '(০, ১)'],
      ans: 1,
      explanation: 'কার্তেসীয় স্থানাঙ্ক ব্যবস্থায় উভয় অক্ষের ছেদবিন্দু তথা মূলবিন্দুর স্থানাঙ্ক (০, ০)।',
    },
    {
      q: 'sin²θ + cos²θ = কত?',
      options: ['০', '১', '-১', '২'],
      ans: 1,
      explanation: 'ত্রিকোণমিতিক মৌলিক অভেদ অনুযায়ী যে কোনো কোণ θ-এর জন্য sin²θ + cos²θ = ১।',
    },
    {
      q: 'দ্বিপদী উপপাদ্য কোন গণিতবিদ আবিষ্কার করেন?',
      options: ['স্যার আইজ্যাক নিউটন', 'ইউক্লিড', 'পীথাগোরাস', 'গাউস'],
      ans: 0,
      explanation: 'যেকোনো ঘাতের জন্য দ্বিপদী উপপাদ্যের সাধারণীকরণ আবিষ্কার করেন আইজ্যাক নিউটন।',
    },
    {
      q: 'কোনো ভেক্টরের মান শূন্য হলে তাকে কী ভেক্টর বলে?',
      options: ['একক ভেক্টর', 'নাল বা শূন্য ভেক্টর', 'বিপ্রতীপ ভেক্টর', 'স্বাধীন ভেক্টর'],
      ans: 1,
      explanation: 'যে ভেক্টরের মান শূন্য এবং যার সুনির্দিষ্ট দিক নেই তাকে শূন্য বা নাল ভেক্টর বলে।',
    },
  ],
  হিসাববিজ্ঞান: [
    {
      q: 'হিসাববিজ্ঞানের জনক কে?',
      options: ['লুকা প্যাসিওলি', 'অ্যাডাম স্মিথ', 'এফ ডব্লিউ টেলর', 'ফিলিপ কোটলার'],
      ans: 0,
      explanation: '১৪৯৪ সালে ইতালির গণিতবিদ লুকা প্যাসিওলি দুতরফা দাখিলা পদ্ধতির ওপর প্রথম বই রচনা করেন।',
    },
    {
      q: 'মৌলিক হিসাব সমীকরণটি কোনটি?',
      options: ['A = L - E', 'A = L + E', 'L = A + E', 'E = A + L'],
      ans: 1,
      explanation: 'মৌলিক হিসাব সমীকরণ: সম্পদ (Assets) = দায় (Liabilities) + মালিকানাস্বত্ব (Equity)।',
    },
    {
      q: 'ব্যবসায়ের প্রাথমিক বই বা আদি বই কোনটি?',
      options: ['খতিয়ান', 'জাবেদা (Journal)', 'রেওয়ামিল', 'নগদান বই'],
      ans: 1,
      explanation: 'লেনদেন সংঘটিত হওয়ার পর তারিখের ক্রমানুসারে ডেবিট-ক্রেডিট বিশ্লেষণ করে সর্বপ্রথম জাবেদায় লেখা হয়।',
    },
    {
      q: 'কোনটি চলতি সম্পদ?',
      options: ['যন্ত্রপাতি', 'আসবাবপত্র', 'দেনাদার বা প্রাপ্য হিসাব', 'দালানকোঠা'],
      ans: 2,
      explanation: 'যে সম্পদ এক বছরের মধ্যে সহজে নগদে রূপান্তর করা যায় (যেমন: দেনাদার, নগদ তহবিল) তা চলতি সম্পদ।',
    },
  ],
  'ব্যবসায় উদ্যোগ': [
    {
      q: 'ব্যবসায় উদ্যোগের মূল ভিত্তি কী?',
      options: ['ঝুঁকি গ্রহণ ও উদ্ভাবন', 'শুধুমাত্র ঋণ গ্রহণ', 'বিজ্ঞাপন প্রচার', 'কম পুঁজিতে ব্যবসা'],
      ans: 0,
      explanation: 'উদ্ভাবনী ধারণা ও মুনাফা অর্জনের উদ্দেশ্যে ঝুঁকি গ্রহণই হলো ব্যবসায় উদ্যোগের মূল উপাদান।',
    },
    {
      q: 'একমালিকানা ব্যবসায়ের সবচেয়ে বড় সুবিধা কোনটি?',
      options: ['সীমাবদ্ধ দায়', 'সহজ গঠন ও দ্রুত সিদ্ধান্ত', 'অসীম স্থায়িত্ব', 'অধিক মূলধন'],
      ans: 1,
      explanation: 'একমালিকানা ব্যবসায় আইনগত ঝামেলা ছাড়াই সহজে গঠন করা যায় এবং মালিক একাই দ্রুত সিদ্ধান্ত নিতে পারেন।',
    },
    {
      q: 'অংশীদারি ব্যবসায়ের মূল ভিত্তি কোনটি?',
      options: ['নিবন্ধন', 'চুক্তি', 'বিজ্ঞাপন', 'মূলধন'],
      ans: 1,
      explanation: 'চুক্তিই হলো অংশীদারি ব্যবসায়ের মূল ভিত্তি (The foundation of partnership is agreement)।',
    },
    {
      q: 'SWOT বিশ্লেষণে ‘S’ দ্বারা কী বোঝায়?',
      options: ['Strategy', 'Strength (শক্তি/সামর্থ্য)', 'Sales', 'Service'],
      ans: 1,
      explanation: 'SWOT = Strengths (শক্তি), Weaknesses (দুর্বলতা), Opportunities (সুযোগ), Threats (হুমকি)।',
    },
  ],
  'ফিন্যান্স ও ব্যাংকিং': [
    {
      q: 'অর্থায়নের মূল উদ্দেশ্য কোনটি?',
      options: ['বিক্রয় বৃদ্ধি', 'সম্পদ সর্বাধিকরণ', 'কর্মী নিয়োগ', 'বিজ্ঞাপন প্রদান'],
      ans: 1,
      explanation: 'আধুনিক অর্থায়নের চূড়ান্ত ও প্রধান লক্ষ্য হলো প্রতিষ্ঠানের সম্পদ সর্বাধিকরণ (Wealth Maximization)।',
    },
    {
      q: 'বাংলাদেশের কেন্দ্রীয় ব্যাংকের নাম কী?',
      options: ['সোনালী ব্যাংক', 'বাংলাদেশ ব্যাংক', 'জনতা ব্যাংক', 'অগ্রণী ব্যাংক'],
      ans: 1,
      explanation: 'বাংলাদেশ ব্যাংক হলো দেশের শীর্ষ আর্থিক প্রতিষ্ঠান ও কেন্দ্রীয় ব্যাংক।',
    },
    {
      q: 'বাণিজ্যিক ব্যাংকের প্রধান আয়ের উৎস কোনটি?',
      options: ['ঋণের সুদের ব্যবধান (Spread)', 'লকার ভাড়া', 'চেক বই বিক্রয়', 'কমিশন'],
      ans: 0,
      explanation: 'আমানতের বিপরীতে প্রদত্ত সুদ এবং ঋণের ওপর ধার্যকৃত সুদের পার্থক্যই হলো ব্যাংকের মূল মুনাফা।',
    },
  ],
  'বাংলাদেশের ইতিহাস ও বিশ্বসভ্যতা': [
    {
      q: 'ঐতিহাসিক পলাশীর যুদ্ধ কত সালে সংঘটিত হয়েছিল?',
      options: ['১৭৫৭ সালের ২৩ জুন', '১৭৬৪ সালের ২২ অক্টোবর', '১৭৬১ সালের ১৪ জানুয়ারি', '১৭৯৩ সালের ১ মে'],
      ans: 0,
      explanation: '১৭৫৭ সালের ২৩ জুন ভাগীরথী নদীর তীরে নবাব সিরাজউদ্দৌলা ও রবার্ট ক্লাইভের মধ্যে পলাশীর যুদ্ধ হয়।',
    },
    {
      q: 'বঙ্গভঙ্গ কত সালে রদ বা বাতিল করা হয়?',
      options: ['১৯০৫ সালে', '১৯০৬ সালে', '১৯১১ সালে', '১৯৪৭ সালে'],
      ans: 2,
      explanation: 'তীব্র স্বদেশী আন্দোলনের মুখে ব্রিটিশ সরকার ১৯১১ সালে বঙ্গভঙ্গ রদ ঘোষণা করে।',
    },
    {
      q: 'বাঙালি জাতির মুক্তির সনদ ‘ছয় দফা’ কত সালে ঘোষিত হয়?',
      options: ['১৯৫২', '১৯৬৬', '১৯৬৯', '১৯৭১'],
      ans: 1,
      explanation: '১৯৬৬ সালে বঙ্গবন্ধু শেখ মুজিবুর রহমান ঐতিহাসিক ছয় দফা কর্মসূচি ঘোষণা করেন।',
    },
  ],
  'পৌরনীতি ও নাগরিকতা': [
    {
      q: '‘Civics’ শব্দটি কোন ল্যাটিন শব্দদ্বয় থেকে এসেছে?',
      options: ['Civis ও Civitas', 'Civil ও City', 'Citizen ও State', 'Civilian ও Policy'],
      ans: 0,
      explanation: 'Civis (নাগরিক) এবং Civitas (নগররাষ্ট্র) থেকে ইংরেজি Civics শব্দের উৎপত্তি।',
    },
    {
      q: 'রাষ্ট্রের সবচেয়ে গুরুত্বপূর্ণ এবং চূড়ান্ত উপাদান কোনটি?',
      options: ['নির্দিষ্ট ভূখণ্ড', 'জনসমষ্টি', 'সরকার', 'সার্বভৌমত্ব'],
      ans: 3,
      explanation: 'সার্বভৌমত্ব হলো রাষ্ট্রের সর্বোচ্চ ও চরম ক্ষমতা, যার বলে রাষ্ট্র অভ্যন্তরীণ ও বাহ্যিক নিয়ন্ত্রণ বজায় রাখে।',
    },
    {
      q: 'পরিবার গঠনের প্রধান পূর্বশর্ত কোনটি?',
      options: ['অর্থ উপার্জন', 'বিবাহবন্ধন', 'গৃহনির্মাণ', 'সম্পদ বণ্টন'],
      ans: 1,
      explanation: 'বিবাহবন্ধন হলো সমাজস্বীকৃত পরিবার গঠনের আদি ও প্রধান ভিত্তি।',
    },
  ],
  'ভূগোল ও পরিবেশ': [
    {
      q: 'পৃথিবীর মোট জলভাগের পরিমাণ শতকরা প্রায় কত?',
      options: ['২৯ ভাগ', '৫১ ভাগ', '৭১ ভাগ', '৮১ ভাগ'],
      ans: 2,
      explanation: 'পৃথিবীর পৃষ্ঠের প্রায় ৭১ ভাগ পানি বা জলভাগ এবং ২৯ ভাগ স্থলভাগ।',
    },
    {
      q: 'বায়ুমণ্ডলের সর্বনিম্ন ও মানবজীবনের জন্য সবচেয়ে গুরুত্বপূর্ণ স্তরের নাম কী?',
      options: ['স্ট্র্যাটোস্ফিয়ার', 'ট্রপোস্ফিয়ার', 'মেসোস্ফিয়ার', 'থার্মোস্ফিয়ার'],
      ans: 1,
      explanation: 'ভূপৃষ্ঠ সংলগ্ন প্রথম স্তরটি হলো ট্রপোস্ফিয়ার, যেখানে মেঘ, বৃষ্টি ও ঝড়ঝঞ্ঝা ঘটে থাকে।',
    },
  ],
  অর্থনীতি: [
    {
      q: 'আধুনিক অর্থনীতির জনক কাকে বলা হয়?',
      options: ['অ্যাডাম স্মিথ', 'পল স্যামুয়েলসন', 'আলফ্রেড মার্শাল', 'জন মেনার্ড কেইনস'],
      ans: 0,
      explanation: '১৭৭৬ সালে ‘Wealth of Nations’ গ্রন্থের রচয়িতা অ্যাডাম স্মিথকে অর্থনীতির জনক বলা হয়।',
    },
    {
      q: 'চাহিদা বিধির মূল শর্ত কোনটি?',
      options: ['দাম বাড়লে চাহিদা বাড়ে', 'দাম বাড়লে চাহিদা কমে', 'আয় বাড়লে দাম কমে', 'যোগান বাড়লে দাম বাড়ে'],
      ans: 1,
      explanation: 'অন্যান্য অবস্থা অপরিবর্তিত থাকলে কোনো দ্রব্যের দাম বাড়লে চাহিদা হ্রাস পায় এবং দাম কমলে চাহিদা বৃদ্ধি পায়।',
    },
  ],
  'সাধারণ বিজ্ঞান': [
    {
      q: 'বায়ুমণ্ডলে অক্সিজেনের পরিমাণ শতকরা প্রায় কত?',
      options: ['৭৮.০৮%', '২০.৯৫%', '০.০৪%', '০.৯৩%'],
      ans: 1,
      explanation: 'বাতাসে নাইট্রোজেনের পরিমাণ প্রায় ৭৮% এবং অক্সিজেন প্রায় ২১% (২০.৯৫%)।',
    },
    {
      q: 'কোন ভিটামিনের অভাবে মানবদেহে রাতকানা রোগ হয়?',
      options: ['ভিটামিন এ', 'ভিটামিন বি', 'ভিটামিন সি', 'ভিটামিন ডি'],
      ans: 0,
      explanation: 'ভিটামিন এ-এর অভাবে চোখের রেটিনার রোডোপসিন তৈরি বিঘ্নিত হয় এবং রাতকানা রোগ দেখা দেয়।',
    },
  ],
  'ইসলাম ও নৈতিক শিক্ষা': [
    {
      q: '‘ঈমান’ শব্দের আভিধানিক অর্থ কী?',
      options: ['বিশ্বাস স্থাপন করা', 'ইবাদত করা', 'দান করা', 'ন্যায়বিচার করা'],
      ans: 0,
      explanation: 'ইসলামের মূল বিষয়গুলোর প্রতি অন্তরে দৃঢ় বিশ্বাস স্থাপন করাকে ঈমান বলে।',
    },
    {
      q: 'ইসলামের স্তম্ভ কয়টি?',
      options: ['৩টি', '৪টি', '৫টি', '৬টি'],
      ans: 2,
      explanation: 'ইসলামের স্তম্ভ ৫টি: কালিমা, নামাজ, রোজা, হজ ও জাকাত।',
    },
  ],
  'হিন্দুধর্ম ও নৈতিক শিক্ষা': [
    {
      q: 'সনাতন ধর্মের মূল ধর্মগ্রন্থ কোনটি?',
      options: ['বেদ', 'গীতা', 'রামায়ণ', 'মহাভারত'],
      ans: 0,
      explanation: 'বেদ হলো সনাতন হিন্দুধর্মের আদি ও প্রধান ধর্মগ্রন্থ।',
    },
    {
      q: 'শ্রীমদ্ভগবদ্গীতা কোন মহাকাব্যের অংশ?',
      options: ['রামায়ণ', 'মহাভারত', 'উপনিষদ', 'বেদ'],
      ans: 1,
      explanation: 'শ্রীমদ্ভগবদ্গীতা মহাভারতের ভীষ্মপর্বের অন্তর্গত একটি পবিত্র অংশ।',
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

// ─── 📦 Dynamic Special Model Test Packages Structure ───
export type PackageUnlockScope = 'single_subject' | 'single_class' | 'all_classes';

export interface QuizPackageItem {
  id: string;
  title: string;
  badge?: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  features: string[];
  unlockScope: PackageUnlockScope;
  isPopular?: boolean;
  isActive: boolean;
  accentColor?: 'blue' | 'red' | 'purple' | 'emerald' | 'amber';
}

export const DEFAULT_QUIZ_PACKAGES: QuizPackageItem[] = [
  {
    id: 'single_subject',
    title: 'Single Subject',
    badge: 'একক বিষয়',
    tagline: 'যেকোনো ১টি বিষয়ের পূর্ণাঙ্গ মডেল টেস্ট ও সমাধান।',
    price: 50,
    originalPrice: 80,
    features: [
      '১টি বিষয়ের সকল প্রশ্ন ও অধ্যায়ভিত্তিক MCQ',
      'ইনস্ট্যান্ট ফলাফল ও গ্রেড শিট',
      'ব্যাখ্যাসহ প্রতিটি প্রশ্নের সঠিক উত্তর',
      'আনলিমিটেড রি-টেস্ট দেওয়ার সুযোগ',
    ],
    unlockScope: 'single_subject',
    isPopular: false,
    isActive: true,
    accentColor: 'blue',
  },
  {
    id: 'full_class',
    title: 'Full Class Package',
    badge: 'জনপ্রিয় অফার',
    tagline: 'এক ক্লাসের সকল বিষয়ের কমপ্লিট স্পেশাল মডেল টেস্ট।',
    price: 150,
    originalPrice: 250,
    features: [
      'সকল বিষয়ের পূর্ণাঙ্গ মডেল টেস্ট',
      'অধ্যায়ভিত্তিক স্পেশাল কুইজ ব্যাংক',
      'মেধা তালিকা / লিডারবোর্ড র‍্যাঙ্কিং ও মেডেল',
      '১০০% সিলেবাস ও নতুন কারিকুলাম কভারেজ',
      '২৪/৭ যেকোনো সময় পরীক্ষা দেওয়ার সুযোগ',
    ],
    unlockScope: 'single_class',
    isPopular: true,
    isActive: true,
    accentColor: 'red',
  },
  {
    id: 'vip_all',
    title: 'Full VIP Package',
    badge: 'সর্বোচ্চ ছাড় • অল-ইন-ওয়ান',
    tagline: '৫ম থেকে ১০ম শ্রেণির সকল বিষয়ের টেস্ট ও এক্সক্লুসিভ সাজেশন।',
    price: 200,
    originalPrice: 400,
    features: [
      '৫ম থেকে ১০ম সকল ক্লাসের আনলিমিটেড টেস্ট',
      'সবগুলো ক্লাসের সকল বিষয় একসাথে সম্পূর্ণ আনলক',
      'মডেল টেস্ট + স্পেশাল সাজেশন সাপোর্ট',
      'লাইভ মেধা তালিকা ও পারফরম্যান্স অ্যানালাইসিস',
      'লাইফটাইম VIP সুবিধা ও প্রায়োরিটি সাপোর্ট',
    ],
    unlockScope: 'all_classes',
    isPopular: false,
    isActive: true,
    accentColor: 'purple',
  },
];

export function getStoredQuizPackages(): QuizPackageItem[] {
  if (typeof window === 'undefined') return DEFAULT_QUIZ_PACKAGES;
  try {
    const raw = localStorage.getItem('sn_quiz_packages_v1');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  return DEFAULT_QUIZ_PACKAGES;
}

export function saveStoredQuizPackages(packages: QuizPackageItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('sn_quiz_packages_v1', JSON.stringify(packages));
  } catch {}
}

// ─── 🖼️ Quiz Card Optional Cover Images Structure ───
export interface QuizCovers {
  classes: Record<string, string>; // e.g. { "5": "url", "10": "url" }
  subjects: Record<string, string>; // e.g. { "পদার্থবিজ্ঞান": "url" }
}

export const DEFAULT_QUIZ_COVERS: QuizCovers = {
  classes: {},
  subjects: {},
};

export function getStoredQuizCovers(): QuizCovers {
  if (typeof window === 'undefined') return DEFAULT_QUIZ_COVERS;
  try {
    const raw = localStorage.getItem('sn_quiz_covers_v1');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return {
          classes: parsed.classes || {},
          subjects: parsed.subjects || {},
        };
      }
    }
  } catch {}
  return DEFAULT_QUIZ_COVERS;
}

export function saveStoredQuizCovers(covers: QuizCovers): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('sn_quiz_covers_v1', JSON.stringify(covers));
  } catch {}
}

// ─── 🃏 Dynamic Custom MCQ / Model Test Cards ───
export interface CustomQuizCard {
  id: string;
  title: string;
  subtitle?: string;
  classGrade: number; // 5 to 10
  subject: string; // e.g. "পদার্থবিজ্ঞান", "সাধারণ গণিত", "English"
  group?: AcademicGroup; // "science", "humanities", "commerce", "compulsory"
  isPaid: boolean;
  price: number; // 0 if free, or e.g. 50
  badge?: string; // e.g. "নতুন", "স্পেশাল", "ফ্রি", "মেগা টেস্ট"
  coverImage?: string; // Individual card cover image URL
  questionCount?: number; // e.g. 20
  durationMinutes?: number; // e.g. 25
  isActive: boolean;
  createdAt?: string;
}

export const DEFAULT_CUSTOM_QUIZ_CARDS: CustomQuizCard[] = [
  {
    id: 'card_ssc_physics_mega',
    title: '১০ম শ্রেণি পদার্থবিজ্ঞান মেগা টেস্ট',
    subtitle: 'বোর্ড স্ট্যান্ডার্ড পূর্ণাঙ্গ মডেল টেস্ট ও ব্যাখ্যাসহ সমাধান',
    classGrade: 10,
    subject: 'পদার্থবিজ্ঞান',
    group: 'science',
    isPaid: true,
    price: 50,
    badge: 'মেগা টেস্ট',
    coverImage: '',
    questionCount: 25,
    durationMinutes: 25,
    isActive: true,
    createdAt: '2026-01-01',
  },
  {
    id: 'card_class8_math_champ',
    title: '৮ম শ্রেণি গণিত মেধা চ্যালেঞ্জ',
    subtitle: 'অধ্যায়ভিত্তিক বাছাইকৃত সৃজনশীল ও বহুনির্বাচনী প্রশ্ন',
    classGrade: 8,
    subject: 'সাধারণ গণিত',
    isPaid: false,
    price: 0,
    badge: 'ফ্রি টেস্ট',
    coverImage: '',
    questionCount: 20,
    durationMinutes: 20,
    isActive: true,
    createdAt: '2026-01-01',
  },
  {
    id: 'card_ssc_chemistry_board',
    title: '৯ম শ্রেণি রসায়ন স্পেশাল কুইজ',
    subtitle: 'নতুন কারিকুলাম ও বোর্ড সিলেবাস অনুযায়ী অনুশীলন',
    classGrade: 9,
    subject: 'রসায়ন',
    group: 'science',
    isPaid: true,
    price: 50,
    badge: 'স্পেশাল',
    coverImage: '',
    questionCount: 20,
    durationMinutes: 20,
    isActive: true,
    createdAt: '2026-01-01',
  },
  {
    id: 'card_class7_english_grammar',
    title: '৭ম শ্রেণি ইংরেজি গ্রামার টেস্ট',
    subtitle: 'Grammar & Vocabulary Mastery Quiz',
    classGrade: 7,
    subject: 'ইংরেজি ১ম পত্র',
    isPaid: false,
    price: 0,
    badge: '১০০% ফ্রি',
    coverImage: '',
    questionCount: 15,
    durationMinutes: 15,
    isActive: true,
    createdAt: '2026-01-01',
  },
];

export function getStoredCustomQuizCards(): CustomQuizCard[] {
  if (typeof window === 'undefined') return DEFAULT_CUSTOM_QUIZ_CARDS;
  try {
    const raw = localStorage.getItem('sn_custom_quiz_cards_v1');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  return DEFAULT_CUSTOM_QUIZ_CARDS;
}

export function saveStoredCustomQuizCards(cards: CustomQuizCard[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('sn_custom_quiz_cards_v1', JSON.stringify(cards));
  } catch {}
}



