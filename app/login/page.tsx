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

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nik: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include", // This is important for cookies
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login response:", data); // Debug log
        
        // Store user data in localStorage
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));

        console.log("User role:", data.user.role); // Debug log
        console.log("Stored user:", localStorage.getItem("user")); // Debug log

        toast.success("Login berhasil!");
        
        // Ensure localStorage is set before redirecting
        try {
          // Wait for localStorage to be set
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Double check that data was stored correctly
          const storedUser = localStorage.getItem("user");
          const storedToken = localStorage.getItem("token");
          
          if (!storedUser || !storedToken) {
            throw new Error("Failed to store user data");
          }

          console.log("About to redirect user with role:", JSON.parse(storedUser).role); // Debug log

          // Redirect based on role
          if (data.user.role === "ADMIN") {
            console.log("Redirecting to admin dashboard"); // Debug log
            router.replace("/dashboard");
          } else if (data.user.role === "VOTER") {
            console.log("Redirecting to user dashboard"); // Debug log
            // Try more forceful navigation approaches
            try {
              await router.replace("/user-dashboard");
              // If router.replace doesn't work, try window.location
              setTimeout(() => {
                window.location.href = "/user-dashboard";
              }, 100);
            } catch (error) {
              console.error("Navigation error:", error);
              // Fallback to window.location
              window.location.href = "/user-dashboard";
            }
          } else {
            throw new Error("Invalid user role");
          }
        } catch (error) {
          console.error("Redirect error:", error);
          toast.error("Terjadi kesalahan saat redirect. Silakan coba lagi.");
        }
      } else {
        toast.error(data.message || "Login gagal. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Gagal terhubung ke server. Mohon periksa koneksi Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
            <CardDescription>Masuk ke akun E-Voting Anda</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nik">NIK</Label>
                <Input
                  id="nik"
                  placeholder="Masukkan NIK Anda"
                  type="text"
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
              <div className="space-y-2 mb-5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan password"
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
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Loading..." : "Login"}
              </Button>
              <div className="text-sm text-center text-muted-foreground">
                Belum punya akun?{" "}
                <Link href="/register" className="text-primary hover:underline">
                  Register
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
