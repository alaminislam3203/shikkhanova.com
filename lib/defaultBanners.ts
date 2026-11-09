export interface BannerItem {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
}

export const DEFAULT_BANNERS: BannerItem[] = [
  {
    id: 'banner-1',
    title: 'শিক্ষানোভা একাডেমি — ৫ম থেকে ১০ম শ্রেণির স্পেশাল ব্যাচে ভর্তি চলছে',
    imageUrl: '/banners/banner-1.svg',
    linkUrl: '/notices',
    displayOrder: 1,
    isActive: true,
    createdAt: '2026-11-09T10:00:00.000Z',
  },
  {
    id: 'banner-2',
    title: '৫ম থেকে ১০ম শ্রেণির প্রিমিয়াম পিডিএফ হ্যান্ডনোট ও চূড়ান্ত সাজেশন',
    imageUrl: '/banners/banner-2.svg',
    linkUrl: '/pdfs',
    displayOrder: 2,
    isActive: true,
    createdAt: '2026-11-09T09:00:00.000Z',
  },
  {
    id: 'banner-3',
    title: 'অনলাইন রেজাল্ট, ডিজিটাল মার্কশিট ও মডেল টেস্ট ফলাফল',
    imageUrl: '/banners/banner-3.svg',
    linkUrl: '/results',
    displayOrder: 3,
    isActive: true,
    createdAt: '2026-11-09T08:00:00.000Z',
  },
];
