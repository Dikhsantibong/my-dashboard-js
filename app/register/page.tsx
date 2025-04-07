"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nik: "",
    password: "",
    fullName: "",
    phoneNumber: "",
    address: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include",
        },
      );

      const data = await response.json().catch(() => null);

      if (response.ok) {
        toast.success("Registrasi berhasil! Silakan login.");
        router.push("/login");
      } else {
        if (data?.message?.includes("nik")) {
          toast.error("NIK sudah terdaftar. Silakan gunakan NIK lain.");
        } else {
          toast.error(data?.message || "Registrasi gagal. Silakan coba lagi.");
        }
      }
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error(
        "Gagal terhubung ke server. Mohon periksa koneksi Anda dan pastikan server berjalan.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Register</CardTitle>
            <CardDescription>Buat akun baru untuk E-Voting</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nik">NIK</Label>
                <Input
                  id="nik"
                  placeholder="Masukkan NIK Anda"
                  value={formData.nik}
                  onChange={(e) =>
                    setFormData({ ...formData, nik: e.target.value })
                  }
                  required
                  disabled={isLoading}
                  minLength={16}
                  maxLength={16}
                  pattern="[0-9]+"
                  title="NIK harus 16 digit angka"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Buat password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  disabled={isLoading}
                  minLength={6}
                  title="Password minimal 6 karakter"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Nama Lengkap</Label>
                <Input
                  id="fullName"
                  placeholder="Masukkan nama lengkap"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Nomor Telepon</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="Masukkan nomor telepon"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  disabled={isLoading}
                  pattern="[0-9]+"
                  title="Hanya masukkan angka"
                />
              </div>
              <div className="space-y-2 mb-5">
                <Label htmlFor="address">Alamat</Label>
                <Input
                  id="address"
                  placeholder="Masukkan alamat lengkap"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  disabled={isLoading}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Loading..." : "Register"}
              </Button>
              <div className="text-sm text-center text-muted-foreground">
                Sudah punya akun?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Login
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
