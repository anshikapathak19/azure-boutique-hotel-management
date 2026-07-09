import React, { useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'

export default function Drawer({ isOpen, onClose, title, children, position = 'right', className = '' }) {
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const slideVariants = {
    right: {
      hidden: { x: '100%' },
      visible: { x: 0 },
    },
    left: {
      hidden: { x: '-100%' },
      visible: { x: 0 },
    },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-navy/55 backdrop-blur-sm"
          />

          {/* Drawer container */}
          <div className={`absolute inset-y-0 ${position === 'right' ? 'right-0' : 'left-0'} max-w-full flex`}>
            <motion.div
              variants={slideVariants[position]}
              initial={shouldReduceMotion ? false : 'hidden'}
              animate="visible"
              exit={shouldReduceMotion ? undefined : 'hidden'}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className={`w-screen max-w-md bg-ivory shadow-xl border-l border-navy/5 overflow-y-auto flex flex-col ${className}`}
              role="dialog"
              aria-modal="true"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-navy/10 bg-white">
                {title && <h2 className="font-display text-xl text-navy">{title}</h2>}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close drawer"
                  className="p-1 text-navy/60 hover:text-gold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col font-body">
                {children}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
