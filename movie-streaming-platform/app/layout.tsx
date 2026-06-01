import type { Metadata } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AppProvider } from '@/lib/context'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ToastContainer } from '@/components/toast-container'
import './globals.css'

const _inter = Inter({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Reverse Movie Hub - Stream Movies & Shows',
  description: 'Welcome to Reverse Movie Hub - Your ultimate destination for streaming movies and TV shows. Discover trending content, build your watchlist, and enjoy cinematic experiences.',
  keywords: ['movies', 'streaming', 'tv shows', 'entertainment', 'watchlist'],
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'Reverse Movie Hub - Stream Movies & Shows',
    description: 'Your ultimate destination for streaming movies and TV shows',
    type: 'website',
  },
}

export const viewport = {
  themeColor: '#e11d48',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased bg-background">
        <AppProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <ToastContainer />
        </AppProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
