'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled = false,
  className = '',
  type = 'button'
}: ButtonProps) => {
  const baseClasses = 'font-sf-pro-text font-medium rounded-full transition-all duration-300 ease-apple transform focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center tracking-tight'
  
  const variantClasses = {
    primary: 'bg-apple-blue hover:bg-apple-blue-dark text-white focus:ring-apple-blue/50 shadow-apple hover:shadow-apple-lg border border-apple-blue hover:border-apple-blue-dark',
    secondary: 'bg-white hover:bg-apple-gray-50 text-apple-gray-900 border border-apple-border focus:ring-apple-gray-300 shadow-apple hover:shadow-apple-lg',
    outline: 'border-2 border-apple-blue text-apple-blue hover:bg-apple-blue hover:text-white focus:ring-apple-blue/50 bg-transparent hover:shadow-apple'
  }
  
  const sizeClasses = {
    sm: 'py-2.5 px-5 text-sm min-h-[40px]',
    md: 'py-3.5 px-7 text-base min-h-[48px]',
    lg: 'py-4 px-9 text-lg min-h-[56px]'
  }

  return (
    <motion.button
      whileHover={{ 
        scale: disabled ? 1 : 1.02,
        y: disabled ? 0 : -1
      }}
      whileTap={{ 
        scale: disabled ? 1 : 0.98,
        y: disabled ? 0 : 0
      }}
      transition={{
        duration: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </motion.button>
  )
}

export default Button