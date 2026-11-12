import React from 'react';
import dynamic from 'next/dynamic';
import HeroSection from '@/components/home/HeroSection';
import AboutPreviewSection from '@/components/home/AboutPreviewSection';
import ClassSelector from '@/components/home/ClassSelector';
import ModelTestShowcaseSection from '@/components/home/ModelTestShowcaseSection';
import SuccessStoriesSection from '@/components/home/SuccessStoriesSection';
import WhyChooseUsSection from '@/components/home/WhyChooseUsSection';
import FeaturesGrid from '@/components/home/FeaturesGrid';
import HomeGallerySection from '@/components/home/HomeGallerySection';
import FaqSection from '@/components/home/FaqSection';
import BranchContactSection from '@/components/home/BranchContactSection';

// Dynamically import client-only animated stats counter with ssr: false to prevent hydration text mismatch
const StatsCounterSection = dynamic(
  () => import('@/components/home/StatsCounterSection'),
  {
    ssr: false,
    loading: () => (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6 py-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-36 sm:h-44 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/80 p-3.5 sm:p-6 shadow-xs animate-pulse"
          />
        ))}
      </div>
    ),
  }
);

export default function HomePage() {
  return (
    <div className="space-y-12 sm:space-y-16">
      {/* 1. Hero Dynamic Banners & Notice Board */}
      <HeroSection />

      {/* 2. Institutional About Showcase (Matching Reference with 'আরও পড়ুন' -> /about) */}
      <AboutPreviewSection />

      {/* 3. Live Impact Stats Counter (Dynamic Social Proof) */}
      <StatsCounterSection />

      {/* 3. Class 5 to 10 Academic Section Selector */}
      <ClassSelector />

      {/* 4. Model Test & Quiz Challenge Showcase */}
      <ModelTestShowcaseSection />

      {/* 5. Success Stories & Achievers Showcase */}
      <SuccessStoriesSection />

      {/* 6. Why Choose Us / Key USPs */}
      <WhyChooseUsSection />

      {/* 7. Key Features & Academic Infrastructure Grid */}
      <FeaturesGrid />

      {/* 8. Campus Life & Event Photo Gallery */}
      <HomeGallerySection />

      {/* 9. Frequently Asked Questions (Accordion) */}
      <FaqSection />

      {/* 10. Contact Us & Campus Location CTA */}
      <BranchContactSection />
    </div>
  );
}

