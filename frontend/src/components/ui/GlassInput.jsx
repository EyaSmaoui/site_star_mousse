import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'

const GlassInput = forwardRef(({
  label,
  error,
  icon,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <motion.input
          whileFocus={{ scale: 1.01 }}
          ref={ref}
          className={`
            w-full rounded-xl px-4 py-3
            bg-white/50 dark:bg-gray-800/50 backdrop-blur-md
            border border-gray-300/50 dark:border-gray-600/50
            text-gray-900 dark:text-gray-100
            placeholder:text-gray-500 dark:placeholder:text-gray-400
            focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20
            transition-all duration-200
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <span className="text-xs text-red-600 dark:text-red-400">{error}</span>
      )}
    </div>
  )
})

GlassInput.displayName = 'GlassInput';

export { GlassInput };
