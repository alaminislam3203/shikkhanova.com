import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import SuccessStoriesSection from '@/components/home/SuccessStoriesSection';
import ClassSelector from '@/components/home/ClassSelector';
import FeaturesGrid from '@/components/home/FeaturesGrid';
import HomeGallerySection from '@/components/home/HomeGallerySection';
import PaymentBanner from '@/components/home/PaymentBanner';
import ContactCards from '@/components/home/ContactCards';

export default function HomePage() {
  return (
    <div className="space-y-12">
      <HeroSection />
      <ClassSelector />
      <SuccessStoriesSection />
      <FeaturesGrid />
      <HomeGallerySection />
      <PaymentBanner />
      <ContactCards />
    </div>
  );
}
