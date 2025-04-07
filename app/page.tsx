'use client';

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  nik: string;
  fullName: string;
  role: string;
}

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (userStr && token) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
        
        // Redirect admin to dashboard
        if (userData.role === 'ADMIN') {
          router.replace('/dashboard');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.clear();
      }
    }
    setIsLoading(false);
  }, []); // Remove router from dependencies

  const handleLogout = () => {
    localStorage.clear();
    router.replace('/login');
  };

  const handleDashboardClick = () => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!userStr || !token) {
      router.replace('/login');
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      if (userData.role === 'VOTER') {
        router.push('/user-dashboard');
      } else if (userData.role === 'ADMIN') {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.replace('/login');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="border-b fixed top-0 left-0 right-0 bg-background z-10">
        <div className="container mx-auto flex h-16 items-center px-4 justify-between">
          <div className="text-2xl font-bold">E-Voting System</div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground">
                  Welcome, {user.fullName}
                </span>
                <Button variant="outline" onClick={handleDashboardClick}>
                  Dashboard
                </Button>
                <Button variant="destructive" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link href="/register">
                  <Button>Register</Button>
                </Link>
              </>
            )}
            <div className="ml-auto flex items-center gap-2">
              <ModeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 mt-16">
        {user ? (
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl font-bold mb-6">Selamat Datang di E-Voting System</h1>
              
              {/* User Information */}
              <div className="bg-card rounded-lg shadow p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Informasi Pengguna</h2>
                <div className="space-y-2">
                  <p><span className="font-medium">NIK:</span> {user.nik}</p>
                  <p><span className="font-medium">Nama:</span> {user.fullName}</p>
                  <p><span className="font-medium">Role:</span> {user.role}</p>
                </div>
                <div className="mt-6">
                  <Button className="w-full" onClick={handleDashboardClick}>
                    Masuk ke Dashboard
                  </Button>
                </div>
              </div>

              {/* Available Elections */}
              <div className="bg-card rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Pemilihan yang Tersedia</h2>
                <div className="text-muted-foreground mb-4">
                  Belum ada pemilihan yang aktif saat ini.
                </div>
                <Button variant="outline" className="w-full" onClick={handleDashboardClick}>
                  Lihat Semua Pemilihan
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                Sistem E-Voting Berbasis Blockchain
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Platform pemilihan yang aman, transparan, dan dapat diverifikasi
                menggunakan teknologi blockchain.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link href="/register">
                  <Button size="lg">Mulai Sekarang</Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" size="lg">
                    Pelajari Lebih Lanjut
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

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
  );
}
