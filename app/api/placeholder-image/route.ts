import { NextResponse } from 'next/server'

export async function GET() {
  // Create a simple SVG placeholder image
  const svg = `
    <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f1f5f9"/>
      <rect x="50" y="50" width="700" height="500" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="2"/>
      <text x="400" y="300" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#64748b">
        Furnished Room Preview
      </text>
      <text x="400" y="340" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#94a3b8">
        (Demo - Replace with actual Gemini image generation)
      </text>
      <!-- Simple furniture shapes -->
      <rect x="150" y="400" width="120" height="80" fill="#8b5cf6" rx="8"/>
      <text x="210" y="445" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="white">Sofa</text>
      <rect x="320" y="420" width="80" height="40" fill="#06b6d4" rx="4"/>
      <text x="360" y="445" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="white">Table</text>
      <circle cx="550" cy="450" r="30" fill="#10b981"/>
      <text x="550" y="455" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="white">Plant</text>
    </svg>
  `

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600'
    }
  })
}
