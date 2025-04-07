"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import Link from 'next/link';

interface User {
  id: string;
  nik: string;
  fullName: string;
  role: string;
}

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        console.log("Checking auth in user dashboard"); // Debug log
        const userStr = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        console.log("User data from storage:", userStr); // Debug log
        console.log("Token from storage:", token ? "exists" : "missing"); // Debug log

        if (!userStr || !token) {
          console.log("Missing user data or token"); // Debug log
          toast.error('Silakan login terlebih dahulu');
          window.location.href = '/login';
          return;
        }

        const userData = JSON.parse(userStr) as User;
        console.log("Parsed user role:", userData.role); // Debug log
        
        // Check if user has VOTER role
        if (userData.role !== 'VOTER') {
          console.log("Invalid role detected:", userData.role); // Debug log
          toast.error('Anda tidak memiliki akses ke halaman ini');
          window.location.href = '/dashboard';
          return;
        }

        console.log("Auth check passed, setting user data"); // Debug log
        setUser(userData);
      } catch (error) {
        console.error("Auth check error:", error);
        localStorage.clear();
        window.location.href = '/login';
      } finally {
        setIsLoading(false);
      }
    };

    // Run the auth check immediately
    checkAuth();
  }, []); // Empty dependency array

  const handleLogout = () => {
    try {
      // Clear localStorage
      localStorage.clear();
      
      // Clear cookies
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      
      toast.success('Logout berhasil');
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Terjadi kesalahan saat logout');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navbar */}
      <nav className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center px-4 justify-between">
          <Link href="/" className="text-2xl font-bold">
            E-Voting System
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user.fullName}
            </span>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
            <ModeToggle />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">User Dashboard</h1>
            <Button variant="outline" onClick={() => router.push('/')}>
              Kembali ke Beranda
            </Button>
          </div>

          {/* User Information Card */}
          <div className="bg-card rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Informasi Pengguna</h2>
            <div className="space-y-2">
              <p><span className="font-medium">NIK:</span> {user.nik}</p>
              <p><span className="font-medium">Nama:</span> {user.fullName}</p>
              <p><span className="font-medium">Role:</span> {user.role}</p>
            </div>
          </div>

          {/* Elections Section */}
          <div className="bg-card rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Pemilihan yang Tersedia</h2>
            <div className="text-muted-foreground mb-4">
              Belum ada pemilihan yang aktif saat ini.
            </div>
          </div>

          {/* Voting History Section */}
          <div className="bg-card rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Riwayat Pemilihan</h2>
            <div className="text-muted-foreground">
              Belum ada riwayat pemilihan.
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            © 2024 E-Voting System. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
