import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="border-b fixed top-0 left-0 right-0 bg-white z-10">
        <div className="container mx-auto flex h-16 items-center px-4 justify-between">
          <div className="text-2xl font-bold">
            E-Voting System
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Register</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 mt-16">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Sistem E-Voting Berbasis Blockchain
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Platform pemilihan yang aman, transparan, dan dapat diverifikasi menggunakan teknologi blockchain.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/register">
                <Button size="lg">
                  Mulai Sekarang
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg">
                  Pelajari Lebih Lanjut
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="container mx-auto px-4 py-24">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border p-6">
              <h3 className="text-lg font-semibold">Aman & Terenkripsi</h3>
              <p className="mt-2 text-muted-foreground">
                Dilindungi dengan teknologi blockchain dan enkripsi end-to-end.
              </p>
            </div>
            <div className="rounded-lg border p-6">
              <h3 className="text-lg font-semibold">Transparan</h3>
              <p className="mt-2 text-muted-foreground">
                Setiap suara dapat diverifikasi dan dilacak secara transparan.
              </p>
            </div>
            <div className="rounded-lg border p-6">
              <h3 className="text-lg font-semibold">Mudah Digunakan</h3>
              <p className="mt-2 text-muted-foreground">
                Interface yang user-friendly dan proses voting yang sederhana.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            © 2024 E-Voting System. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
