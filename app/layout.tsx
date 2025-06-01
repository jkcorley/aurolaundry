import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { BottomNav } from "@/components/BottomNav"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { CartProvider } from "@/contexts/cart-context"
import { ChatDashModal } from "@/components/ChatDashModal"

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
}

export const metadata: Metadata = {
  title: "Auro Admin",
  description: "Auro Laundry Management System",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body className={cn(inter.className, "h-full bg-gray-50")}>        
        <CartProvider>
          <SidebarProvider>
            <AppSidebar />
            <main className="min-h-screen md:pl-56 pb-20 md:pb-0 pt-0">
              {children}
            </main>
            <BottomNav />
            <ChatDashModal />
          </SidebarProvider>
        </CartProvider>
      </body>
    </html>
  )
}
