import React from 'react'
import { motion } from 'framer-motion'

const variants = {
  primary: 'bg-gradient-to-r from-brand-600 to-brand-700 text-white border-brand-500',
  secondary: 'bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-gray-200 border-gray-300/50 dark:border-gray-600/50',
  ghost: 'bg-transparent text-gray-700 dark:text-gray-300 border-transparent',
  destructive: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-500',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

export function GlassButton({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled = false,
  ...props
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        inline-flex items-center justify-center gap-2 rounded-xl font-semibold
        border backdrop-blur-md transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        shadow-lg hover:shadow-xl
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : (
        leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </motion.button>
  )
}