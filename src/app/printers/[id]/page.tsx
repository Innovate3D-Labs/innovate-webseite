'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import SectionSeparator from '@/components/ui/SectionSeparator'
import { useAuth } from '@/lib/context/AuthContext'
import { 
  WifiIcon, 
  ArrowLeftIcon, 
  PlayIcon, 
  PauseIcon, 
  StopIcon,
  ArrowPathIcon,
  CogIcon,
  FireIcon,
  CubeIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import { notify } from '@/components/ui/NotificationSystem'

interface PrinterDetails {
  id: string
  name: string
  model: string
  status: 'online' | 'offline' | 'printing' | 'paused' | 'error'
  ipAddress: string
  firmware: string
  temperatures: {
    hotend: { current: number; target: number }
    bed: { current: number; target: number }
  }
  currentJob?: {
    name: string
    progress: number
    timeElapsed: string
    timeRemaining: string
    layerHeight: number
    currentLayer: number
    totalLayers: number
  }
  stats: {
    totalPrintTime: string
    successfulPrints: number
    failedPrints: number
    filamentUsed: string
  }
}

export default function PrinterDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [isConnecting, setIsConnecting] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login?redirect=/printers')
    }
  }, [user, isLoading, router])

  // Don't render if not authenticated
  if (isLoading) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen pt-20 bg-gray-50">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!user) {
    return null
  }
  
  // Mock printer data - in real app, fetch from API
  const [printer] = useState<PrinterDetails>({
    id: params.id as string,
    name: 'Office Printer',
    model: 'Innovate3D Pro X1',
    status: 'printing',
    ipAddress: '192.168.1.100',
    firmware: 'Marlin 2.1.2',
    temperatures: {
      hotend: { current: 205, target: 210 },
      bed: { current: 58, target: 60 }
    },
    currentJob: {
      name: 'gear_mechanism.stl',
      progress: 67,
      timeElapsed: '2h 15m',
      timeRemaining: '1h 23m',
      layerHeight: 0.2,
      currentLayer: 134,
      totalLayers: 200
    },
    stats: {
      totalPrintTime: '342h 15m',
      successfulPrints: 156,
      failedPrints: 12,
      filamentUsed: '12.5 kg'
    }
  })

  const [temperatures, setTemperatures] = useState(printer.temperatures)
  const [showSettings, setShowSettings] = useState(false)

  const handlePause = () => {
    setIsConnecting(true)
    setTimeout(() => {
      setIsConnecting(false)
      notify.success('Druck pausiert', 'Der Druckvorgang wurde erfolgreich pausiert.')
    }, 1000)
  }

  const handleStop = () => {
    if (confirm('Möchten Sie den Druck wirklich abbrechen?')) {
      setIsConnecting(true)
      setTimeout(() => {
        setIsConnecting(false)
        notify.warning('Druck abgebrochen', 'Der Druckvorgang wurde abgebrochen.')
        router.push('/printers')
      }, 1000)
    }
  }

  const handleTemperatureChange = (type: 'hotend' | 'bed', value: number) => {
    setTemperatures(prev => ({
      ...prev,
      [type]: { ...prev[type], target: value }
    }))
  }

  const applyTemperatures = () => {
    setIsConnecting(true)
    setTimeout(() => {
      setIsConnecting(false)
      notify.success('Temperaturen aktualisiert', 'Die Zieltemperaturen wurden erfolgreich gesetzt.')
    }, 1000)
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {/* Header with Back Button */}
          <div className="mb-8">
            <button
              onClick={() => router.push('/printers')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Zurück zu meinen Druckern</span>
            </button>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{printer.name}</h1>
                <p className="text-gray-600">{printer.model} • Firmware: {printer.firmware}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <WifiIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">{printer.ipAddress}</span>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  printer.status === 'online' || printer.status === 'printing' ? 'bg-green-500' : 'bg-gray-400'
                }`} />
              </div>
            </div>
          </div>

          <SectionSeparator spacing="md" variant="gradient" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Control Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current Print Job */}
              {printer.currentJob && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                    <CubeIcon className="w-5 h-5" />
                    <span>Aktueller Druckauftrag</span>
                  </h2>
                  
                  <div className="mb-4">
                    <h3 className="font-medium text-gray-900">{printer.currentJob.name}</h3>
                    <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Verstrichene Zeit:</span>
                        <span className="ml-2 font-medium">{printer.currentJob.timeElapsed}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Verbleibend:</span>
                        <span className="ml-2 font-medium">{printer.currentJob.timeRemaining}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Schicht:</span>
                        <span className="ml-2 font-medium">
                          {printer.currentJob.currentLayer} / {printer.currentJob.totalLayers}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Schichthöhe:</span>
                        <span className="ml-2 font-medium">{printer.currentJob.layerHeight}mm</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Fortschritt</span>
                      <span className="font-medium">{printer.currentJob.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${printer.currentJob.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={handlePause}
                      disabled={isLoading}
                      className="flex-1 flex items-center justify-center space-x-2 bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50"
                    >
                      <PauseIcon className="w-5 h-5" />
                      <span>Pausieren</span>
                    </button>
                    <button
                      onClick={handleStop}
                      disabled={isLoading}
                      className="flex-1 flex items-center justify-center space-x-2 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      <StopIcon className="w-5 h-5" />
                      <span>Abbrechen</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Temperature Control */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <FireIcon className="w-5 h-5" />
                  <span>Temperatursteuerung</span>
                </h2>

                <div className="space-y-4">
                  {/* Hotend Temperature */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hotend Temperatur
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <input
                          type="range"
                          min="0"
                          max="300"
                          value={temperatures.hotend.target}
                          onChange={(e) => handleTemperatureChange('hotend', parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">{temperatures.hotend.current}°C</span>
                        <span className="text-gray-600"> / </span>
                        <span className="font-medium text-blue-600">{temperatures.hotend.target}°C</span>
                      </div>
                    </div>
                  </div>

                  {/* Bed Temperature */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Druckbett Temperatur
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <input
                          type="range"
                          min="0"
                          max="120"
                          value={temperatures.bed.target}
                          onChange={(e) => handleTemperatureChange('bed', parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">{temperatures.bed.current}°C</span>
                        <span className="text-gray-600"> / </span>
                        <span className="font-medium text-blue-600">{temperatures.bed.target}°C</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={applyTemperatures}
                    disabled={isLoading}
                    className="w-full bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    Temperaturen anwenden
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Statistics */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <ChartBarIcon className="w-5 h-5" />
                  <span>Statistiken</span>
                </h2>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Gesamte Druckzeit</p>
                    <p className="font-semibold">{printer.stats.totalPrintTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Erfolgreiche Drucke</p>
                    <p className="font-semibold text-green-600">{printer.stats.successfulPrints}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fehlgeschlagene Drucke</p>
                    <p className="font-semibold text-red-600">{printer.stats.failedPrints}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Filament verbraucht</p>
                    <p className="font-semibold">{printer.stats.filamentUsed}</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4">Schnellaktionen</h2>
                
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                    <ArrowPathIcon className="w-5 h-5" />
                    <span>Auto-Level</span>
                  </button>
                  <button 
                    onClick={() => setShowSettings(!showSettings)}
                    className="w-full flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <CogIcon className="w-5 h-5" />
                    <span>Einstellungen</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionSeparator spacing="xl" variant="gradient" />
        </div>
      </main>
      <Footer />
    </>
  )
} 