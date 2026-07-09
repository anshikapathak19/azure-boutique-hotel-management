import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

export default function Tabs({ items = [], activeTab, onChange, className = '' }) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className={`border-b border-navy/10 flex gap-8 overflow-x-auto scrollbar-none ${className}`}>
      {items.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`relative py-4 text-sm font-body uppercase tracking-wider font-semibold focus-visible:outline-none transition-colors duration-300 ${isActive ? 'text-gold' : 'text-navy/55 hover:text-navy'}`}
          >
            {tab.label}
            {isActive && (
              <motion.div
                layoutId="activeTabUnderline"
                transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 30 }}
                className="absolute bottom-0 inset-x-0 h-0.5 bg-gold"
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
