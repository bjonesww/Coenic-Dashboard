import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Corenic Construction - Executive Dashboard',
  description: 'Financial analytics and KPI tracking for leadership',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-neutral-50">
        {children}
      </body>
    </html>
  )
}