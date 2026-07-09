import React from 'react'
import LoadingSpinner from './LoadingSpinner.jsx'

export default function DataTable({
  columns = [],
  data = [],
  isLoading = false,
  emptyMessage = 'No records found.',
  className = '',
}) {
  return (
    <div className={`overflow-x-auto rounded-2xl border border-navy/5 bg-white shadow-sm shadow-navy/5 ${className}`}>
      <table className="w-full text-left border-collapse font-body text-sm text-navy/80">
        <thead>
          <tr className="border-b border-navy/10 bg-ivory/50">
            {columns.map((col, idx) => (
              <th
                key={col.key || idx}
                className={`px-6 py-4 font-semibold uppercase tracking-wider text-xs text-navy/60 ${col.headerClassName || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-navy/5">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center">
                <div className="flex flex-col items-center justify-center gap-3">
                  <LoadingSpinner className="w-6 h-6 text-gold" />
                  <span className="text-navy/50 text-xs">Loading records...</span>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-navy/50">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr key={row.id || rowIdx} className="hover:bg-ivory/20 transition-colors">
                {columns.map((col, colIdx) => (
                  <td
                    key={col.key || colIdx}
                    className={`px-6 py-4 ${col.className || ''}`}
                  >
                    {col.render ? col.render(row, rowIdx) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
