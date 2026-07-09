import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatCard({ title, value, change, isPositive, icon: Icon, className = '' }) {
  const isTrendUp = isPositive !== undefined ? isPositive : change && change.startsWith('+')
  
  return (
    <div className={`bg-white rounded-2xl p-6 border border-navy/5 shadow-sm shadow-navy/5 flex items-center justify-between ${className}`}>
      <div>
        <span className="font-body text-xs font-medium text-navy/55 uppercase tracking-wider block">
          {title}
        </span>
        <h3 className="font-display text-2xl md:text-3xl text-navy mt-2 font-semibold">
          {value}
        </h3>
        {change && (
          <div className="flex items-center gap-1 mt-2">
            {isTrendUp ? (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
            )}
            <span className={`font-body text-xs font-semibold ${isTrendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
              {change}
            </span>
            <span className="font-body text-xs text-navy/40 ml-1">vs last period</span>
          </div>
        )}
      </div>
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold">
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  )
}
