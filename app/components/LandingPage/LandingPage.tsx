import React from 'react'
import Hero from './intro/Hero'
import StatsSection from './intro/SecSection'
import HowItWorks from './intro/HowItWorks';
import Pricing from './intro/Pricing';

const LandingPage = () => {
  return (
    <>
      <Hero />
      <StatsSection />
      <HowItWorks />
      <Pricing />
    </>
  );
}

export default LandingPage