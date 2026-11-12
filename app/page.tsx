import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import StatsCounterSection from '@/components/home/StatsCounterSection';
import ClassSelector from '@/components/home/ClassSelector';
import ModelTestShowcaseSection from '@/components/home/ModelTestShowcaseSection';
import SuccessStoriesSection from '@/components/home/SuccessStoriesSection';
import WhyChooseUsSection from '@/components/home/WhyChooseUsSection';
import FeaturesGrid from '@/components/home/FeaturesGrid';
import DirectorMessageSection from '@/components/home/DirectorMessageSection';
import HomeGallerySection from '@/components/home/HomeGallerySection';
import FaqSection from '@/components/home/FaqSection';
import BranchContactSection from '@/components/home/BranchContactSection';

export default function HomePage() {
  return (
    <div className="space-y-12 sm:space-y-16">
      {/* 1. Hero Dynamic Banners & Quick Action Badges */}
      <HeroSection />

      {/* 2. Live Impact Stats Counter (Dynamic Social Proof) */}
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

      {/* 8. Director's Speech & Institutional Leadership */}
      <DirectorMessageSection />

      {/* 9. Campus Life & Event Photo Gallery */}
      <HomeGallerySection />

      {/* 10. Frequently Asked Questions (Accordion) */}
      <FaqSection />

      {/* 11. Branch Location, Helpline & Contact CTA */}
      <BranchContactSection />
    </div>
  );
}

