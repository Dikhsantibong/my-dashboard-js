"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

import {
  UsersIcon,
  UserCheckIcon,
  Vote as VoteIcon,
  Settings as SettingsIcon,
  Home as HomeIcon,
  LogOut as LogOutIcon,
  BarChart as ChartBarIcon,
} from "lucide-react";

export function AppSidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    // Clear localStorage
    localStorage.clear();
    // Clear cookies
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    // Redirect to login
    window.location.href = '/login';
  };

  return (
    <div className="flex h-screen w-64 flex-col bg-background border-r">
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <div className="space-y-1">
              <h2 className="mb-4 px-4 text-xl font-semibold tracking-tight">
                E-Voting Admin
              </h2>
              <nav className="space-y-2">
                <Link href="/dashboard" passHref>
                  <Button
                    variant={pathname === "/dashboard" ? "default" : "ghost"}
                    className="w-full justify-start"
                  >
                    <HomeIcon className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/dashboard/voters" passHref>
                  <Button
                    variant={pathname === "/dashboard/voters" ? "default" : "ghost"}
                    className="w-full justify-start"
                  >
                    <UsersIcon className="mr-2 h-4 w-4" />
                    Kelola Pemilih
                  </Button>
                </Link>
                <Link href="/dashboard/verification" passHref>
                  <Button
                    variant={pathname === "/dashboard/verification" ? "default" : "ghost"}
                    className="w-full justify-start"
                  >
                    <UserCheckIcon className="mr-2 h-4 w-4" />
                    Verifikasi Pemilih
                  </Button>
                </Link>
                <Link href="/dashboard/elections" passHref>
                  <Button
                    variant={pathname === "/dashboard/elections" ? "default" : "ghost"}
                    className="w-full justify-start"
                  >
                    <VoteIcon className="mr-2 h-4 w-4" />
                    Kelola Pemilihan
                  </Button>
                </Link>
                <Link href="/dashboard/results" passHref>
                  <Button
                    variant={pathname === "/dashboard/results" ? "default" : "ghost"}
                    className="w-full justify-start"
                  >
                    <ChartBarIcon className="mr-2 h-4 w-4" />
                    Hasil Pemilihan
                  </Button>
                </Link>
                <Link href="/dashboard/settings" passHref>
                  <Button
                    variant={pathname === "/dashboard/settings" ? "default" : "ghost"}
                    className="w-full justify-start"
                  >
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    Pengaturan
                  </Button>
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 border-t">
        <Button
          variant="destructive"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOutIcon className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
