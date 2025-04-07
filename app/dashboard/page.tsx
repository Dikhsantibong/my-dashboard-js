"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DashboardStats {
  totalVoters: number;
  verifiedVoters: number;
  totalCandidates: number;
  activeElections: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalVoters: 0,
    verifiedVoters: 0,
    totalCandidates: 0,
    activeElections: 0,
  });

  useEffect(() => {
    const checkAuth = () => {
      try {
        const userStr = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (!userStr || !token) {
          toast.error('Silakan login terlebih dahulu');
          window.location.href = '/login';
          return;
        }

        const userData = JSON.parse(userStr);
        if (userData.role !== 'ADMIN') {
          toast.error('Anda tidak memiliki akses ke halaman ini');
          window.location.href = '/user-dashboard';
          return;
        }
      } catch (error) {
        console.error('Auth check error:', error);
        window.location.href = '/login';
      }
    };

    const fetchStats = async () => {
      try {
        // TODO: Replace with actual API call
        const response = await fetch('http://localhost:3001/admin/stats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    checkAuth();
    fetchStats();
  }, []);

  return (
    <div className="flex-1 space-y-4 p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pemilih</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVoters}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pemilih Terverifikasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.verifiedVoters}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Kandidat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCandidates}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pemilihan Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeElections}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button variant="outline">Tambah Pemilihan</Button>
          <Button variant="outline">Verifikasi Pemilih</Button>
          <Button variant="outline">Kelola Kandidat</Button>
        </CardContent>
      </Card>
    </div>
  );
}
