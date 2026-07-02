import type { Metadata } from "next"
import { ThemeProvider } from "@/components/layout/theme-provider"
import { Sidebar } from "@/components/layout/sidebar"
import "./globals.css"

export const metadata: Metadata = {
  title: "PredictFlow AI - Simulate Before You Act",
  description:
    "AI-powered simulation platform that predicts consequences before actions are executed. Make safer decisions with predictive analytics.",
  keywords: ["AI simulation", "risk prediction", "decision intelligence", "what-if analysis"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="min-h-screen">
            <Sidebar />
            <main className="lg:pl-56">
              <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">{children}</div>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
