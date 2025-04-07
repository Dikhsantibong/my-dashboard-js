"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

interface Election {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED';
  totalVoters: number;
  totalVotes: number;
}

export default function ElectionsPage() {
  const [elections, setElections] = useState<Election[]>([]);

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

    checkAuth();
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const response = await fetch('http://localhost:3001/admin/elections', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setElections(data);
      }
    } catch (error) {
      console.error('Failed to fetch elections:', error);
      toast.error('Gagal memuat data pemilihan');
    }
  };

  const getStatusBadgeClass = (status: Election['status']) => {
    switch (status) {
      case 'UPCOMING':
        return 'bg-blue-100 text-blue-700';
      case 'ACTIVE':
        return 'bg-green-100 text-green-700';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: Election['status']) => {
    switch (status) {
      case 'UPCOMING':
        return 'Akan Datang';
      case 'ACTIVE':
        return 'Sedang Berlangsung';
      case 'COMPLETED':
        return 'Selesai';
      default:
        return status;
    }
  };

  return (
    <main className="flex-1 p-6">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Kelola Pemilihan</h1>
          <Button>Tambah Pemilihan Baru</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Pemilihan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Judul</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead>Tanggal Mulai</TableHead>
                    <TableHead>Tanggal Selesai</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total Pemilih</TableHead>
                    <TableHead>Total Suara</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {elections.map((election) => (
                    <TableRow key={election.id}>
                      <TableCell className="font-medium">{election.title}</TableCell>
                      <TableCell>{election.description}</TableCell>
                      <TableCell>{new Date(election.startDate).toLocaleDateString('id-ID')}</TableCell>
                      <TableCell>{new Date(election.endDate).toLocaleDateString('id-ID')}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(election.status)}`}>
                          {getStatusText(election.status)}
                        </span>
                      </TableCell>
                      <TableCell>{election.totalVoters}</TableCell>
                      <TableCell>{election.totalVotes}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm">Detail</Button>
                          <Button variant="destructive" size="sm">Hapus</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
} 