import Hero from '@/components/landing/Hero.jsx'
import FeaturedRooms from '@/components/landing/FeaturedRooms.jsx'
import LuxuryExperience from '@/components/landing/LuxuryExperience.jsx'

export default function LandingPage() {
  return (
    <>
      <Hero />
      <FeaturedRooms />
      <LuxuryExperience />
      {/* Amenities, Testimonials, Gallery, Newsletter arrive in later milestones */}
    </>
  )
}