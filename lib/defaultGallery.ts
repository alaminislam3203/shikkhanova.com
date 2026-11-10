export interface GalleryPhoto {
  id: string;
  title: string;
  subtitle: string;
  category: 'classroom' | 'award' | 'exam' | 'campus';
  categoryLabel: string;
  date: string;
  imageUrl: string;
  createdAt?: string;
}

export const CATEGORY_MAP: Record<GalleryPhoto['category'], string> = {
  classroom: 'ক্লাসরুম ও পাঠদান',
  exam: 'পরীক্ষা ও মূল্যায়ন',
  award: 'পুরস্কার ও সংবর্ধনা',
  campus: 'একাডেমিক কার্যক্রম',
};

export const DEFAULT_GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'g-1',
    title: 'শ্রেণিকক্ষে মাল্টিমিডিয়া ও ইন্টারেক্টিভ পাঠদান',
    subtitle: '৯ম ও ১০ম শ্রেণির বিজ্ঞান ও গণিত স্পেশাল ব্যাচ • জুম্মাপাড়া, নীলফামারী সদর',
    category: 'classroom',
    categoryLabel: 'ক্লাসরুম ও পাঠদান',
    date: 'নভেম্বর ২০২৬',
    imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80',
    createdAt: '2026-11-01T10:00:00.000Z',
  },
  {
    id: 'g-2',
    title: 'মাসিক মূল্যায়ন ও মডেল টেস্ট পরীক্ষা গ্রহণ',
    subtitle: 'সুশৃঙ্খল পরিবেশে ৫ম থেকে ১০ম শ্রেণির শিক্ষার্থীদের লিখিত ও এমসিকিউ পরীক্ষা',
    category: 'exam',
    categoryLabel: 'পরীক্ষা ও মূল্যায়ন',
    date: 'অক্টোবর ২০২৬',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1000&q=80',
    createdAt: '2026-10-20T10:00:00.000Z',
  },
  {
    id: 'g-3',
    title: 'কৃতি শিক্ষার্থীদের মাঝে পুরস্কার ও সনদপত্র বিতরণ',
    subtitle: 'GPA 5.00 ও মেধাতালিকায় উত্তীর্ণ শিক্ষার্থীদের বিশেষ সংবর্ধনা অনুষ্ঠান',
    category: 'award',
    categoryLabel: 'পুরস্কার ও সংবর্ধনা',
    date: 'অক্টোবর ২০২৬',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80',
    createdAt: '2026-10-15T10:00:00.000Z',
  },
  {
    id: 'g-4',
    title: 'অধ্যায়ভিত্তিক প্রিমিয়াম হ্যান্ডনোট ও শিট প্রস্তুতি',
    subtitle: 'শিক্ষা নোভা গবেষণা ও সম্পাদনা পর্ষদের প্রস্তুতকৃত এক্সক্লুসিভ হ্যান্ডনোট',
    category: 'campus',
    categoryLabel: 'একাডেমিক কার্যক্রম',
    date: 'সেপ্টেম্বর ২০২৬',
    imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1000&q=80',
    createdAt: '2026-09-25T10:00:00.000Z',
  },
  {
    id: 'g-5',
    title: 'গ্রুপ স্টাডি ও বিশেষ প্রবলেম সলভিং সেশন',
    subtitle: '৭ম ও ৮ম শ্রেণির শিক্ষার্থীদের গণিত ও ইংরেজি বিষয়ের নিবিড় তত্ত্বাবধান',
    category: 'classroom',
    categoryLabel: 'ক্লাসরুম ও পাঠদান',
    date: 'সেপ্টেম্বর ২০২৬',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80',
    createdAt: '2026-09-10T10:00:00.000Z',
  },
  {
    id: 'g-6',
    title: 'অভিভাবক সমাবেশ ও একাডেমিক মতবিনিময় সভা',
    subtitle: 'শিক্ষার্থীদের অগ্রগতি ও ফলাফল নিয়ে অভিভাবকদের সাথে নিয়মিত পরামর্শ সভা',
    category: 'award',
    categoryLabel: 'পুরস্কার ও সংবর্ধনা',
    date: 'আগস্ট ২০২৬',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80',
    createdAt: '2026-08-18T10:00:00.000Z',
  },
];

