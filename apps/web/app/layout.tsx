import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SmartStickyNote',
  description: 'NEO Second Brain',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
