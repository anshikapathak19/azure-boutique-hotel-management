import { motion, useReducedMotion } from 'framer-motion'
import { Gem, Compass, ShieldCheck, Heart } from 'lucide-react'
import Container from '@/components/ui/Container.jsx'

export default function AboutPage() {
  const shouldReduceMotion = useReducedMotion()

  const VALUES = [
    {
      icon: Compass,
      title: 'Curated Discovery',
      description: 'We hand-select each destination, ensuring it represents the absolute pinnacle of architecture, regional character, and service.'
    },
    {
      icon: ShieldCheck,
      title: 'Uncompromised Standards',
      description: 'From Egyptian cotton linens to dedicated butler calls, our portfolio guarantees an elite level of comfort and privacy.'
    },
    {
      icon: Heart,
      title: 'Local Stewardship',
      description: 'We partner with hotels that honor their surroundings, support heritage preservation, and promote sustainable tourism.'
    }
  ]

  return (
    <div className="bg-ivory text-navy pt-32 pb-24">
      {/* Hero Section */}
      <section className="py-12 md:py-20 border-b border-navy/5">
        <Container className="max-w-4xl text-center">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 text-gold text-xs font-body font-semibold tracking-widest uppercase">
              <Gem className="w-3 h-3" /> Our Philosophy
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-medium tracking-tight text-navy leading-tight">
              Crafting Sanctuaries of <br />
              <span className="italic font-normal text-gold">Timeless Luxury</span>
            </h1>
            <p className="font-body text-base md:text-lg text-navy/70 leading-relaxed max-w-2xl mx-auto">
              AzureStay was born from a singular vision: to curate the world’s most remarkable boutique hotels into an exclusive portfolio, creating seamless transitions to architectural masterworks.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="font-display text-3xl md:text-4xl text-navy">The AzureStay Legacy</h2>
              <p className="font-body text-sm md:text-base text-navy/70 leading-relaxed">
                Founded in 2024, AzureStay set out to redefine the online hotel booking experience for the modern, discerning traveler. We believe that a hotel should not merely be a place to stay, but a destination in its own right—an immersive experience that stays with you long after checkout.
              </p>
              <p className="font-body text-sm md:text-base text-navy/70 leading-relaxed">
                Our founders traveled across continents, visiting remote mountain chalets, hidden coastal villas, and heritage urban machiyas. Out of thousands, only a select few met our meticulous standards for design integrity, local character, and highly tailored guest services.
              </p>
            </motion.div>

            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl"
            >
              <img
                src="/src/assets/images/gallery/gallery-01.jpg"
                alt="Luxury resort overlooking coast"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-navy/10" />
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white border-y border-navy/5">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-4xl text-navy">Our Core Values</h2>
            <p className="font-body text-sm text-navy/55 mt-3">
              Every property we list and every service we offer is guided by these principles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {VALUES.map((item, idx) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={idx}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="space-y-4 text-center md:text-left"
                >
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold mx-auto md:mx-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-xl text-navy font-semibold">{item.title}</h3>
                  <p className="font-body text-sm text-navy/60 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </Container>
      </section>
    </div>
  )
}
