import { NextRequest, NextResponse } from 'next/server'

// Setup codes database - should match the one in ../route.ts
const SETUP_CODES = {
  'IX1-9847': { 
    name: 'Innovate3D Pro X1', 
    model: 'Innovate3D Pro X1', 
    ip: '192.168.1.101',
    manufacturer: 'Innovate3D Labs'
  },
  'IX2-3421': { 
    name: 'Innovate3D Pro X2', 
    model: 'Innovate3D Pro X2', 
    ip: '192.168.1.102',
    manufacturer: 'Innovate3D Labs'
  },
  'IST-7729': { 
    name: 'Innovate3D Starter', 
    model: 'Innovate3D Starter', 
    ip: '192.168.1.103',
    manufacturer: 'Innovate3D Labs'
  },
  'PRO-5567': { 
    name: 'ProMaker 3000', 
    model: 'ProMaker 3000', 
    ip: '192.168.1.104',
    manufacturer: 'ProMaker Inc.'
  },
  'MID-8813': { 
    name: 'MidRange Printer', 
    model: 'Generic Model', 
    ip: '192.168.1.105',
    manufacturer: 'Generic Manufacturing'
  }
}

// POST /api/printers/validate-code - Validate a setup code without adding the printer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { setupCode } = body

    if (!setupCode) {
      return NextResponse.json(
        { error: 'Setup code is required' },
        { status: 400 }
      )
    }

    const normalizedCode = setupCode.toUpperCase().trim()
    const codeData = SETUP_CODES[normalizedCode as keyof typeof SETUP_CODES]

    if (!codeData) {
      return NextResponse.json(
        { 
          valid: false, 
          error: 'Invalid setup code. Please check the code and try again.' 
        },
        { status: 200 }
      )
    }

    return NextResponse.json({
      valid: true,
      printer: {
        name: codeData.name,
        model: codeData.model,
        manufacturer: codeData.manufacturer,
        ipAddress: codeData.ip
      },
      message: `Setup code valid for ${codeData.name}`
    })
  } catch (error) {
    console.error('Error validating setup code:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/printers/validate-code - Get information about available setup codes (for testing)
export async function GET() {
  try {
    const availableCodes = Object.keys(SETUP_CODES).map(code => ({
      code,
      name: SETUP_CODES[code as keyof typeof SETUP_CODES].name,
      model: SETUP_CODES[code as keyof typeof SETUP_CODES].model
    }))

    return NextResponse.json({
      message: 'Available setup codes for testing',
      codes: availableCodes
    })
  } catch (error) {
    console.error('Error getting setup codes:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 