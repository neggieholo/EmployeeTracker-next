import React from 'react'
import MobileHero from './intro/MobileHero'
import MobileStatsSection from './intro/MobileSecSection'
import MobilePlatformShowcase from './intro/MobileHowItWorks'
import MobilePricing from './intro/MobilePricing'

const MobileLandingPage = () => {
  return (
    <>
      <MobileHero />
      <MobileStatsSection />
      <MobilePlatformShowcase />
      <MobilePricing />
    </>
  )
}

export default MobileLandingPage