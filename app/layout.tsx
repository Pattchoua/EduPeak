import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import ToasterProvider from '@/components/providers/ToasterProvider'
import ConfettiProvider from '@/components/providers/ConfettiProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EduPeak',
  description: 'EduPeak is your gateway to a world of knowledge and achievement. Explore a diverse marketplace of courses, handcrafted by expert educators. Students can purchase courses, track their progress, and earn certifications. Teachers have the power to create, price, and structure their courses, fostering interactive learning experiences. Our user-friendly platform combines affordability, quality, and convenience, making education accessible to all. Join EduPeak and embark on your journey to success!',
  icons: {
    icon: "/assets/images/site-logo.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ConfettiProvider/>
          <ToasterProvider/>
          {children}
          
          </body>
      </html>
    </ClerkProvider>
  )
}
