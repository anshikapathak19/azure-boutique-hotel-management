import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success') => {
    const id = 'toast-' + Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
    
    // Automatically dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const value = useMemo(() => ({ addToast, removeToast }), [addToast, removeToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={[
                'pointer-events-auto flex items-start gap-3.5 p-4 rounded-xl shadow-lg border text-sm font-body font-medium',
                toast.type === 'error'
                  ? 'bg-rose-50 border-rose-100 text-rose-800'
                  : toast.type === 'info'
                    ? 'bg-blue-50 border-blue-100 text-blue-800'
                    : 'bg-emerald-50 border-emerald-100 text-emerald-800',
              ].join(' ')}
            >
              <span className="shrink-0 mt-0.5">
                {toast.type === 'error' ? (
                  <AlertCircle className="w-5 h-5 text-rose-500" />
                ) : toast.type === 'info' ? (
                  <Info className="w-5 h-5 text-blue-500" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                )}
              </span>
              <div className="flex-1 leading-relaxed">{toast.message}</div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="shrink-0 text-navy/40 hover:text-navy/70 transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
