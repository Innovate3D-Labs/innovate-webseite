'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import SectionSeparator from '@/components/ui/SectionSeparator'
import { useAuth } from '@/lib/context/AuthContext'
import { 
  WifiIcon, 
  PlusIcon, 
  CubeIcon, 
  ExclamationTriangleIcon,
  QrCodeIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'
import { notify } from '@/components/ui/NotificationSystem'

interface Printer {
  id: string
  name: string
  model: string
  status: 'online' | 'offline' | 'printing' | 'error'
  ipAddress: string
  lastSeen?: Date
  currentJob?: {
    name: string
    progress: number
    timeRemaining: string
  }
}

export default function PrintersPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [printers, setPrinters] = useState<Printer[]>([])
  const [showAddPrinter, setShowAddPrinter] = useState(false)
  const [setupMethod, setSetupMethod] = useState<'code' | 'manual'>('code')
  const [setupCode, setSetupCode] = useState('')
  const [newPrinter, setNewPrinter] = useState({
    name: '',
    ipAddress: '',
    model: ''
  })
  const [isConnecting, setIsConnecting] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      notify.error('Anmeldung erforderlich', 'Sie müssen sich anmelden, um Ihre Drucker zu verwalten.')
      router.push('/auth/login?redirect=/printers')
    }
  }, [user, isLoading, router])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen pt-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className="text-gray-600">Laden...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // Don't render the page content if user is not authenticated
  if (!user) {
    return null
  }

  // Simulate setup codes for different printer models
  const validSetupCodes = {
    'IX1-9847': { name: 'Innovate3D Pro X1', model: 'Innovate3D Pro X1', ip: '192.168.1.101' },
    'IX2-3421': { name: 'Innovate3D Pro X2', model: 'Innovate3D Pro X2', ip: '192.168.1.102' },
    'IST-7729': { name: 'Innovate3D Starter', model: 'Innovate3D Starter', ip: '192.168.1.103' },
    'PRO-5567': { name: 'ProMaker 3000', model: 'ProMaker 3000', ip: '192.168.1.104' },
    'MID-8813': { name: 'MidRange Printer', model: 'Generic Model', ip: '192.168.1.105' }
  }

  const handleSetupWithCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsConnecting(true)

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const codeData = validSetupCodes[setupCode.toUpperCase() as keyof typeof validSetupCodes]
      
      if (!codeData) {
        throw new Error('Ungültiger Setup-Code')
      }
      
      const printer: Printer = {
        id: Date.now().toString(),
        name: codeData.name,
        model: codeData.model,
        status: 'online',
        ipAddress: codeData.ip,
        lastSeen: new Date()
      }
      
      setPrinters(prev => [...prev, printer])
      setSetupCode('')
      setShowAddPrinter(false)
      
      notify.success('Drucker hinzugefügt', `${printer.name} wurde erfolgreich über Setup-Code verbunden.`)
    } catch (error) {
      notify.error('Setup-Fehler', 'Setup-Code ungültig oder Drucker nicht erreichbar.')
    } finally {
      setIsConnecting(false)
    }
  }

  const handleAddPrinter = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsConnecting(true)

    try {
      // Simulate printer connection
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const printer: Printer = {
        id: Date.now().toString(),
        name: newPrinter.name,
        model: newPrinter.model || 'Unknown Model',
        status: 'online',
        ipAddress: newPrinter.ipAddress,
        lastSeen: new Date()
      }
      
      setPrinters(prev => [...prev, printer])
      setNewPrinter({ name: '', ipAddress: '', model: '' })
      setShowAddPrinter(false)
      
      notify.success('Drucker hinzugefügt', `${printer.name} wurde erfolgreich verbunden.`)
    } catch (error) {
      notify.error('Verbindungsfehler', 'Drucker konnte nicht verbunden werden.')
    } finally {
      setIsConnecting(false)
    }
  }

  const getStatusColor = (status: Printer['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'offline': return 'bg-gray-400'
      case 'printing': return 'bg-blue-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-400'
    }
  }

  const getStatusText = (status: Printer['status']) => {
    switch (status) {
      case 'online': return 'Online'
      case 'offline': return 'Offline'
      case 'printing': return 'Druckt'
      case 'error': return 'Fehler'
      default: return 'Unbekannt'
    }
  }

  const handleConnectToPrinter = (printerId: string) => {
    router.push(`/printers/${printerId}`)
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Meine Drucker</h1>
            <p className="text-lg text-gray-600">
              Verwalten Sie Ihre 3D-Drucker und überwachen Sie Druckaufträge in Echtzeit.
            </p>
          </div>

          <SectionSeparator spacing="md" variant="gradient" />

          {/* Add Printer Button */}
          <div className="mb-8 flex justify-end">
            <button
              onClick={() => setShowAddPrinter(!showAddPrinter)}
              className="flex items-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Drucker hinzufügen</span>
            </button>
          </div>

          {/* Add Printer Form */}
          {showAddPrinter && (
            <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Neuen Drucker verbinden</h3>
              
              {/* Setup Method Toggle */}
              <div className="mb-6">
                <div className="flex space-x-4 bg-gray-100 p-1 rounded-lg w-fit">
                  <button
                    type="button"
                    onClick={() => setSetupMethod('code')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                      setupMethod === 'code' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <QrCodeIcon className="w-4 h-4" />
                    <span>Setup-Code</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSetupMethod('manual')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                      setupMethod === 'manual' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Cog6ToothIcon className="w-4 h-4" />
                    <span>Manuell</span>
                  </button>
                </div>
              </div>

              {/* Setup Code Form */}
              {setupMethod === 'code' && (
                <form onSubmit={handleSetupWithCode} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Setup-Code eingeben
                    </label>
                    <input
                      type="text"
                      value={setupCode}
                      onChange={(e) => setSetupCode(e.target.value.toUpperCase())}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-center text-lg font-mono tracking-wider"
                      placeholder="XXX-9999"
                      maxLength={8}
                      pattern="[A-Z]{2,3}-[0-9]{4}"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Den Setup-Code finden Sie auf dem Drucker-Display oder in der Anleitung
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Beispiel Setup-Codes zum Testen:</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-blue-700">
                        <span className="font-mono">IX1-9847</span> - Innovate3D Pro X1
                      </div>
                      <div className="text-blue-700">
                        <span className="font-mono">IX2-3421</span> - Innovate3D Pro X2
                      </div>
                      <div className="text-blue-700">
                        <span className="font-mono">IST-7729</span> - Innovate3D Starter
                      </div>
                      <div className="text-blue-700">
                        <span className="font-mono">PRO-5567</span> - ProMaker 3000
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      disabled={isConnecting || setupCode.length < 7}
                      className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                      {isConnecting ? 'Verbinde...' : 'Drucker hinzufügen'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddPrinter(false)}
                      className="text-gray-600 hover:text-gray-900 px-6 py-2"
                    >
                      Abbrechen
                    </button>
                  </div>
                </form>
              )}

              {/* Manual Setup Form */}
              {setupMethod === 'manual' && (
                <form onSubmit={handleAddPrinter} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Drucker Name
                    </label>
                    <input
                      type="text"
                      value={newPrinter.name}
                      onChange={(e) => setNewPrinter({ ...newPrinter, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      placeholder="z.B. Büro Drucker"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      IP-Adresse
                    </label>
                    <input
                      type="text"
                      value={newPrinter.ipAddress}
                      onChange={(e) => setNewPrinter({ ...newPrinter, ipAddress: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      placeholder="192.168.1.100"
                      pattern="^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Drucker Modell (optional)
                    </label>
                    <select
                      value={newPrinter.model}
                      onChange={(e) => setNewPrinter({ ...newPrinter, model: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    >
                      <option value="">Modell auswählen...</option>
                      <option value="Innovate3D Pro X1">Innovate3D Pro X1</option>
                      <option value="Innovate3D Pro X2">Innovate3D Pro X2</option>
                      <option value="Innovate3D Starter">Innovate3D Starter</option>
                      <option value="Other">Anderes Modell</option>
                    </select>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      disabled={isConnecting}
                      className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                      {isConnecting ? 'Verbinde...' : 'Verbinden'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddPrinter(false)}
                      className="text-gray-600 hover:text-gray-900 px-6 py-2"
                    >
                      Abbrechen
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Printers Grid or Empty State */}
          {printers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {printers.map((printer) => (
                <div key={printer.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  {/* Printer Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{printer.name}</h3>
                      <p className="text-sm text-gray-600">{printer.model}</p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(printer.status)}`} />
                  </div>

                  {/* Status */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <WifiIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{printer.ipAddress}</span>
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      Status: <span className="font-medium">{getStatusText(printer.status)}</span>
                    </div>
                  </div>

                  {/* Current Job (if printing) */}
                  {printer.status === 'printing' && printer.currentJob && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <CubeIcon className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">
                          {printer.currentJob.name}
                        </span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2 mb-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${printer.currentJob.progress}%` }}
                        />
                      </div>
                      <div className="text-xs text-blue-700">
                        {printer.currentJob.progress}% - {printer.currentJob.timeRemaining} verbleibend
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => handleConnectToPrinter(printer.id)}
                      className="flex-1 bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors text-sm"
                    >
                      Verbinden
                    </button>
                    <button 
                      onClick={() => handleConnectToPrinter(printer.id)}
                      className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16">
              <CubeIcon className="w-16 h-16 text-gray-300 mx-auto mb-6" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Noch keine Drucker verbunden</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Fügen Sie Ihren ersten 3D-Drucker mit einem Setup-Code oder manuell hinzu.
              </p>
              <button
                onClick={() => setShowAddPrinter(true)}
                className="inline-flex items-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <PlusIcon className="w-5 h-5" />
                <span>Ersten Drucker hinzufügen</span>
              </button>
            </div>
          )}

          <SectionSeparator spacing="xl" variant="dots" />

          {/* Info Section */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-yellow-900 mb-1">Setup-Hinweise</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• <strong>Setup-Code:</strong> Einfachste Methode - Code vom Drucker-Display eingeben</li>
                  <li>• <strong>Manuell:</strong> Für erweiterte Benutzer oder nicht unterstützte Drucker</li>
                  <li>• <strong>Netzwerk:</strong> Drucker muss im gleichen WLAN-Netzwerk sein</li>
                </ul>
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