'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  padding?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'glass' | 'elevated'
}

const Card = ({ 
  children, 
  className = '', 
  hover = true,
  padding = 'md',
  variant = 'default'
}: CardProps) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  }

  const variantClasses = {
    default: 'bg-white border border-apple-border shadow-apple',
    glass: 'bg-apple-glass backdrop-blur-xl border border-apple-border/50 shadow-apple',
    elevated: 'bg-white border border-apple-border shadow-apple-lg'
  }

  const hoverClasses = hover ? {
    default: 'hover:shadow-apple-lg hover:border-apple-border-hover',
    glass: 'hover:shadow-apple-lg hover:bg-apple-glass-hover',
    elevated: 'hover:shadow-apple-xl hover:-translate-y-1'
  } : { default: '', glass: '', elevated: '' }

  return (
    <motion.div
      whileHover={hover ? { 
        y: variant === 'elevated' ? -4 : -2,
        transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
      } : {}}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={`
        rounded-3xl 
        transition-all 
        duration-300 
        ease-apple
        ${variantClasses[variant]} 
        ${hoverClasses[variant]} 
        ${paddingClasses[padding]} 
        ${className}
      `}
    >
      {children}
    </motion.div>
  )
}

export default Card