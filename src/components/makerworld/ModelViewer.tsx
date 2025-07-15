'use client'

import { useState, useRef } from 'react'
import { ArrowsPointingOutIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface ModelViewerProps {
  modelUrl?: string
  title?: string
  onClose?: () => void
}

const ModelViewer: React.FC<ModelViewerProps> = ({ 
  modelUrl, 
  title = "3D Model", 
  onClose 
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <div 
      className={`relative ${
        isFullscreen 
          ? 'fixed inset-0 z-50 bg-black' 
          : 'w-full h-96 bg-gray-100 rounded-lg'
      }`}
    >
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
        <h3 className={`font-medium ${isFullscreen ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={toggleFullscreen}
            className={`p-2 rounded-lg transition-colors ${
              isFullscreen 
                ? 'bg-black/50 text-white hover:bg-black/70' 
                : 'bg-white/80 text-gray-700 hover:bg-white'
            }`}
          >
            <ArrowsPointingOutIcon className="w-5 h-5" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isFullscreen 
                  ? 'bg-black/50 text-white hover:bg-black/70' 
                  : 'bg-white/80 text-gray-700 hover:bg-white'
              }`}
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* 3D Model Container */}
      <div 
        ref={containerRef}
        className="w-full h-full flex items-center justify-center"
      >
        {!modelUrl ? (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
              <svg 
                className="w-8 h-8 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" 
                />
              </svg>
            </div>
            <p className={`text-sm ${isFullscreen ? 'text-gray-300' : 'text-gray-500'}`}>
              Keine 3D-Modell Vorschau verfügbar
            </p>
            <p className={`text-xs mt-1 ${isFullscreen ? 'text-gray-400' : 'text-gray-400'}`}>
              STL/OBJ-Viewer wird geladen...
            </p>
          </div>
        ) : error ? (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-lg flex items-center justify-center">
              <XMarkIcon className="w-8 h-8 text-red-500" />
            </div>
            <p className={`text-sm ${isFullscreen ? 'text-white' : 'text-red-600'}`}>
              Fehler beim Laden des 3D-Modells
            </p>
            <p className={`text-xs mt-1 ${isFullscreen ? 'text-gray-300' : 'text-gray-500'}`}>
              {error}
            </p>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-lg flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
            <p className={`text-sm ${isFullscreen ? 'text-white' : 'text-gray-700'}`}>
              3D-Modell wird geladen...
            </p>
          </div>
        )}
      </div>

      {/* Instructions */}
      {!error && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className={`text-xs text-center ${
            isFullscreen ? 'text-gray-300' : 'text-gray-500'
          }`}>
            3D-Modell Viewer (Demo) - Vollständige STL/OBJ-Unterstützung in Entwicklung
          </div>
        </div>
      )}
    </div>
  )
}

export default ModelViewer 