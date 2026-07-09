import Hero from '@/components/landing/Hero.jsx'
import HotelSearch from '@/components/landing/HotelSearch.jsx'
import FeaturedRooms from '@/components/landing/FeaturedRooms.jsx'
import LuxuryExperience from '@/components/landing/LuxuryExperience.jsx'
import WhyChooseAzureStay from '@/components/landing/WhyChooseAzureStay.jsx'
import GalleryPreview from '@/components/landing/GalleryPreview.jsx'
import Testimonials from '@/components/landing/Testimonials.jsx'
import CallToAction from '@/components/landing/CallToAction.jsx'

export default function LandingPage() {
  return (
    <>
      <Hero />
      <HotelSearch />
      <FeaturedRooms />
      <LuxuryExperience />
      <WhyChooseAzureStay />
      <GalleryPreview />
      <Testimonials />
      <CallToAction />
    </>
  )
}