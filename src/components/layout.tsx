'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { FileText, Search, BarChart2, LogOut } from 'lucide-react'

export function LayoutComponent({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="bg-[#000080] text-white p-4">
        <nav className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">LawScribe</Link>
          <div className="space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-white hover:text-[#8B0000]">
                Dashboard
              </Button>
            </Link>
            <Link href="/create-fir">
              <Button variant="ghost" className="text-white hover:text-[#8B0000]">
                <FileText className="mr-2 h-4 w-4" />
                Create FIR
              </Button>
            </Link>
            <Link href="/search-fir">
              <Button variant="ghost" className="text-white hover:text-[#8B0000]">
                <Search className="mr-2 h-4 w-4" />
                Search FIR
              </Button>
            </Link>
            <Link href="/analytics">
              <Button variant="ghost" className="text-white hover:text-[#8B0000]">
                <BarChart2 className="mr-2 h-4 w-4" />
                Analytics
              </Button>
            </Link>
            <Button variant="ghost" className="text-white hover:text-[#8B0000]">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </nav>
      </header>
      <main className="flex-grow container mx-auto py-8">
        {children}
      </main>
      <footer className="bg-[#000080] text-white p-4">
        <div className="container mx-auto text-center">
          <Link href="/support" className="hover:underline mr-4">Support</Link>
          <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
        </div>
      </footer>
    </div>
  )
}