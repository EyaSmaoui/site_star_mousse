import React from 'react'
import { motion } from 'framer-motion'

export function GlassCard({
  children,
  className = '',
  hover = true,
  glass = true,
  ...props
}) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      className={`
        rounded-2xl p-6 ${glass ? 'bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl' : ''}
        border border-white/20 dark:border-gray-700/50
        shadow-xl hover:shadow-2xl transition-all duration-300
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  )
}