import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MiMo DePIN Node Copilot',
  description: 'AI assistant untuk install, debug, dan monitor DePIN nodes',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50">
        {children}
      </body>
    </html>
  )
}
