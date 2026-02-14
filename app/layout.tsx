import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Indie Wrestler Database | Rankings & Stats',
  description: 'Track and rank independent professional wrestlers by popularity across social media, Reddit, and podcasts',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black">
        <header className="bg-gradient-to-r from-gray-900 via-black to-gray-900 border-b-4 border-yellow-500 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-black tracking-tight">
                  <span className="text-gradient-gold">INDIE</span>{' '}
                  <span className="text-white">WRESTLER</span>{' '}
                  <span className="text-red-600">DATABASE</span>
                </h1>
                <p className="text-sm text-gray-400 mt-1 font-semibold tracking-wide uppercase">
                  The Ultimate Independent Wrestling Rankings
                </p>
              </div>
              <div className="hidden md:flex gap-4">
                <div className="text-right">
                  <div className="text-yellow-500 text-2xl font-bold">LIVE</div>
                  <div className="text-xs text-gray-400 uppercase">Rankings</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="min-h-screen">{children}</main>

        <footer className="bg-gradient-to-r from-gray-900 via-black to-gray-900 border-t-4 border-yellow-500 mt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
              <div>
                <h3 className="text-yellow-500 font-bold text-lg mb-2">DATA SOURCES</h3>
                <p className="text-gray-400 text-sm">
                  Twitter • Instagram • Reddit • Podcasts
                </p>
              </div>
              <div>
                <h3 className="text-yellow-500 font-bold text-lg mb-2">UPDATES</h3>
                <p className="text-gray-400 text-sm">
                  Rankings updated daily at 2:00 AM EST
                </p>
              </div>
              <div>
                <h3 className="text-yellow-500 font-bold text-lg mb-2">COVERAGE</h3>
                <p className="text-gray-400 text-sm">
                  Independent wrestlers worldwide
                </p>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-6 pt-6 text-center text-gray-500 text-sm">
              © 2026 Indie Wrestler Database • Powered by social data
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
