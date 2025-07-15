import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Setup codes database - in production, this would be in the database
const SETUP_CODES = {
  'IX1-9847': { 
    name: 'Innovate3D Pro X1', 
    model: 'Innovate3D Pro X1', 
    ip: '192.168.1.101',
    apiKey: 'demo_api_key_ix1'
  },
  'IX2-3421': { 
    name: 'Innovate3D Pro X2', 
    model: 'Innovate3D Pro X2', 
    ip: '192.168.1.102',
    apiKey: 'demo_api_key_ix2'
  },
  'IST-7729': { 
    name: 'Innovate3D Starter', 
    model: 'Innovate3D Starter', 
    ip: '192.168.1.103',
    apiKey: 'demo_api_key_ist'
  },
  'PRO-5567': { 
    name: 'ProMaker 3000', 
    model: 'ProMaker 3000', 
    ip: '192.168.1.104',
    apiKey: 'demo_api_key_pro'
  },
  'MID-8813': { 
    name: 'MidRange Printer', 
    model: 'Generic Model', 
    ip: '192.168.1.105',
    apiKey: 'demo_api_key_mid'
  }
}

// Helper function to get user ID from request headers
async function getUserIdFromRequest(request: NextRequest): Promise<string | null> {
  try {
    // In production, verify JWT token here
    // For now, return a mock user ID for testing
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return null
    }
    
    // Mock user ID - in production, decode JWT token
    return 'user_123'
  } catch {
    return null
  }
}

// Helper function to validate setup code
function validateSetupCode(code: string): { name: string; model: string; ip: string; apiKey: string } | null {
  const normalizedCode = code.toUpperCase().trim()
  return SETUP_CODES[normalizedCode as keyof typeof SETUP_CODES] || null
}

// GET /api/printers - Get all printers for authenticated user
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Mock data for now - in production, fetch from database
    const printers = [
      {
        id: '1',
        userId,
        name: 'Example Printer',
        model: 'Innovate3D Pro X1',
        status: 'online',
        ipAddress: '192.168.1.100',
        apiKey: 'encrypted_api_key',
        lastSeen: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    return NextResponse.json({ printers })
  } catch (error) {
    console.error('Error fetching printers:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/printers - Add a new printer (supports both setup codes and manual configuration)
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { setupCode, name, ipAddress, model, apiKey } = body

    let printerData: any = {}

    // Handle setup code
    if (setupCode) {
      const codeData = validateSetupCode(setupCode)
      if (!codeData) {
        return NextResponse.json(
          { error: 'Invalid setup code' },
          { status: 400 }
        )
      }
      
      printerData = {
        name: codeData.name,
        model: codeData.model,
        ipAddress: codeData.ip,
        apiKey: codeData.apiKey
      }
    } else {
      // Handle manual configuration
      if (!name || !ipAddress) {
        return NextResponse.json(
          { error: 'Name and IP address are required for manual setup' },
          { status: 400 }
        )
      }

      // Validate IP address format
      const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/
      if (!ipRegex.test(ipAddress)) {
        return NextResponse.json(
          { error: 'Invalid IP address format' },
          { status: 400 }
        )
      }

      printerData = {
        name,
        model: model || 'Unknown Model',
        ipAddress,
        apiKey: apiKey || null
      }
    }

    // Mock printer creation - in production, save to database
    const printer = {
      id: Date.now().toString(),
      userId,
      ...printerData,
      status: 'connecting',
      lastSeen: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Simulate connection test
    setTimeout(() => {
      // In production, actually test connection to printer
      printer.status = 'online'
    }, setupCode ? 1500 : 2000) // Setup codes connect faster

    return NextResponse.json({ 
      printer,
      message: setupCode 
        ? `Printer connected via setup code ${setupCode}` 
        : 'Printer added manually'
    }, { status: 201 })
  } catch (error) {
    console.error('Error adding printer:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/printers/:id - Remove a printer
export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const printerId = url.searchParams.get('id')

    if (!printerId) {
      return NextResponse.json(
        { error: 'Printer ID is required' },
        { status: 400 }
      )
    }

    // Mock deletion - in production, delete from database
    // Also verify that the printer belongs to the user

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting printer:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 