import React from 'react'

interface SectionSeparatorProps {
  spacing?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'line' | 'dots' | 'gradient' | 'none'
}

const SectionSeparator: React.FC<SectionSeparatorProps> = ({ 
  spacing = 'md',
  variant = 'line' 
}) => {
  const spacingClasses = {
    sm: 'my-8',
    md: 'my-12',
    lg: 'my-16',
    xl: 'my-20'
  }

  const separatorContent = () => {
    switch (variant) {
      case 'line':
        return <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      
      case 'dots':
        return (
          <div className="flex justify-center items-center space-x-2">
            <div className="w-1 h-1 bg-gray-300 rounded-full" />
            <div className="w-1 h-1 bg-gray-300 rounded-full" />
            <div className="w-1 h-1 bg-gray-300 rounded-full" />
          </div>
        )
      
      case 'gradient':
        return (
          <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-50" />
        )
      
      case 'none':
        return null
      
      default:
        return <div className="w-full h-px bg-gray-200" />
    }
  }

  return (
    <div className={`${spacingClasses[spacing]} flex items-center`}>
      {separatorContent()}
    </div>
  )
}

export default SectionSeparator 