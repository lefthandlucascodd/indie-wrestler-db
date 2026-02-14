import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Indie Wrestler Database',
  description: 'Track and rank independent professional wrestlers by popularity',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <header className="border-b">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold">Indie Wrestler Database</h1>
            <p className="text-sm text-gray-600">
              Tracking independent pro wrestlers by popularity
            </p>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">{children}</main>
        <footer className="border-t mt-8">
          <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-600">
            Data updated daily from social media, Reddit, and podcasts
          </div>
        </footer>
      </body>
    </html>
  )
}
