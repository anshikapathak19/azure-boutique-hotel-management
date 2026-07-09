import React, { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import Container from '@/components/ui/Container.jsx'
import SectionHeading from '@/components/ui/SectionHeading.jsx'

const FAQ_ITEMS = [
  {
    question: 'What is direct booking, and what are the benefits?',
    answer: 'Booking directly through AzureStay guarantees you the absolute best rates, direct communication with the hotel concierge team before your arrival, and complimentary room upgrade priority for our Gold and Platinum Elite members.',
  },
  {
    question: 'Can I cancel or modify my reservation?',
    answer: 'Yes. Cancellation policies depend on the specific hotel and rate booked. Most rates offer free cancellation up to 48 hours before check-in. You can manage and request cancellations directly inside your Guest Dashboard.',
  },
  {
    question: 'How are hotels vetted for the AzureStay portfolio?',
    answer: 'Every property goes through a rigorous inspection process covering architectural integrity, service excellence, local integration, and environmental sustainability. Only hotels meeting our standard of quiet luxury are accepted.',
  },
  {
    question: 'What cloud services power the AzureStay booking engine?',
    answer: 'AzureStay is built on Microsoft Azure, leveraging Cosmos DB for sub-millisecond database queries, Blob Storage for high-definition hotel photography, and Azure Functions to trigger instant SMS and email notifications.',
  },
]

export default function FAQ() {
  const shouldReduceMotion = useReducedMotion()
  const [openIndex, setOpenIndex] = useState(null)

  const toggleIndex = (index) => {
    setOpenIndex((current) => (current === index ? null : index))
  }

  return (
    <section id="faq" className="py-24 md:py-32 bg-ivory">
      <Container className="max-w-4xl">
        <SectionHeading
          eyebrow="Common Inquiries"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about the AzureStay boutique experience."
          align="center"
        />

        <div className="mt-16 space-y-4">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-navy/5 shadow-sm overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleIndex(idx)}
                  className="w-full flex items-center justify-between p-6 md:p-8 font-display text-lg text-navy text-left outline-none cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span>{item.question}</span>
                  <span className="shrink-0 ml-4 w-8 h-8 rounded-full bg-ivory flex items-center justify-center text-navy/60 group-hover:text-navy transition-colors">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={shouldReduceMotion ? false : { height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={shouldReduceMotion ? undefined : { height: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 md:px-8 md:pb-8 border-t border-navy/5 pt-4 font-body text-sm text-navy/70 leading-relaxed">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
