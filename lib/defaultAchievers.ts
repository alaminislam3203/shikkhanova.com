export interface AchieverItem {
  id: string;
  name: string;
  classGrade: number; // 6, 7, 8, 9, 10
  classLabel: string;
  achievement: string;
  institution: string;
  photoUrl: string;
  badge?: string;
  year?: string;
}

export const DEFAULT_ACHIEVERS: AchieverItem[] = [
  {
    id: 'ach-1',
    name: 'মারিয়া আক্তার মুন্নি',
    classGrade: 8,
    classLabel: '৮ম শ্রেণি (জুনিয়র মেধা বৃত্তি)',
    achievement: 'ট্যালেন্টপুল বৃত্তি ও গণিতে ১০০/১০০',
    institution: 'নীলফামারী সরকারি বালিকা উচ্চ বিদ্যালয়',
    photoUrl:
      'https://res.cloudinary.com/demo/image/upload/c_fill,g_face,w_450,h_520,q_auto,f_auto/rachel.jpg',
    badge: 'ট্যালেন্টপুল',
    year: '২০২৬',
  },
  {
    id: 'ach-2',
    name: 'তাহমিদ আশহাব',
    classGrade: 9,
    classLabel: '৯ম শ্রেণি (বিজ্ঞান বিভাগ)',
    achievement: 'মেধা স্থান ১ম • বিজ্ঞান অলিম্পিয়াড রানার-আপ',
    institution: 'নীলফামারী সরকারি উচ্চ বিদ্যালয়',
    photoUrl:
      'https://res.cloudinary.com/demo/image/upload/c_fill,g_face,w_450,h_520,q_auto,f_auto/boy.jpg',
    badge: '১ম স্থান',
    year: '২০২৬',
  },
  {
    id: 'ach-3',
    name: 'আরাফাত রোহান',
    classGrade: 7,
    classLabel: '৭ম শ্রেণি (একাডেমিক মূল্যায়ন)',
    achievement: 'শ্রেণি মূল্যায়ন ১ম স্থান • জিপিএ ৫.০০',
    institution: 'নীলফামারী সরকারি উচ্চ বিদ্যালয়',
    photoUrl:
      'https://res.cloudinary.com/demo/image/upload/c_fill,g_face,w_450,h_520,q_auto,f_auto/smiling_man.jpg',
    badge: 'GPA 5.00',
    year: '২০২৬',
  },
  {
    id: 'ach-4',
    name: 'মো: আসিফ-উজ-জামান',
    classGrade: 10,
    classLabel: '১০ম শ্রেণি (SSC ২০২৬ প্রস্তুতি)',
    achievement: 'মডেল টেস্ট ১ম • গোল্ডেন A+ (GPA 5.00)',
    institution: 'নীলফামারী সরকারি উচ্চ বিদ্যালয়',
    photoUrl:
      'https://res.cloudinary.com/demo/image/upload/c_fill,g_face,w_450,h_520,q_auto,f_auto/front_face.jpg',
    badge: 'গোল্ডেন A+',
    year: '২০২৬',
  },
  {
    id: 'ach-5',
    name: 'ফাতেমা তুজ জোহরা',
    classGrade: 10,
    classLabel: '১০ম শ্রেণি (বিজ্ঞান বিভাগ)',
    achievement: 'প্রাক-নির্বাচনি পরীক্ষায় ১ম • জিপিএ ৫.০০',
    institution: 'নীলফামারী সরকারি বালিকা উচ্চ বিদ্যালয়',
    photoUrl:
      'https://res.cloudinary.com/demo/image/upload/c_fill,g_face,w_450,h_520,q_auto,f_auto/lady.jpg',
    badge: 'মেধা বৃত্তি',
    year: '২০২৬',
  },
  {
    id: 'ach-6',
    name: 'তানভীর হাসান',
    classGrade: 6,
    classLabel: '৬ষ্ঠ শ্রেণি (নতুন শিক্ষাক্রম)',
    achievement: 'গণিত ও বিজ্ঞান পারদর্শিতা ১ম স্থান',
    institution: 'নীলফামারী কালেক্টরেট স্কুল অ্যান্ড কলেজ',
    photoUrl:
      'https://res.cloudinary.com/demo/image/upload/c_fill,g_face,w_450,h_520,q_auto,f_auto/face_top.jpg',
    badge: '১ম স্থান',
    year: '২০২৬',
  },
  {
    id: 'ach-7',
    name: 'সুমাইয়া জাহান',
    classGrade: 9,
    classLabel: '৯ম শ্রেণি (ব্যবসায় শিক্ষা)',
    achievement: 'হিসাববিজ্ঞান ও ব্যবসায় উদ্যোগে সর্বোচ্চ নম্বর',
    institution: 'নীলফামারী সরকারি বালিকা উচ্চ বিদ্যালয়',
    photoUrl:
      'https://res.cloudinary.com/demo/image/upload/c_fill,g_face,w_450,h_520,q_auto,f_auto/young_couple.jpg',
    badge: 'টপ স্কোরার',
    year: '২০২৬',
  },
  {
    id: 'ach-8',
    name: 'হাসিবুর রহমান',
    classGrade: 6,
    classLabel: '৬ষ্ঠ শ্রেণি (মেধাবৃত্তি)',
    achievement: 'প্রাথমিক বৃত্তিপ্রাপ্ত • কোচিং মূল্যায়নে ১ম',
    institution: 'নীলফামারী সরকারি উচ্চ বিদ্যালয়',
    photoUrl:
      'https://res.cloudinary.com/demo/image/upload/c_fill,g_face,w_450,h_520,q_auto,f_auto/boy.jpg',
    badge: 'বৃত্তিপ্রাপ্ত',
    year: '২০২৬',
  },
];
