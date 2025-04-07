"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

interface PendingVoter {
  id: string;
  nik: string;
  fullName: string;
  address: string;
  phoneNumber: string;
  createdAt: string;
}

export default function VerificationPage() {
  const [pendingVoters, setPendingVoters] = useState<PendingVoter[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

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
    fetchPendingVoters();
  }, []);

  const fetchPendingVoters = async () => {
    try {
      const response = await fetch('http://localhost:3001/admin/pending-voters', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPendingVoters(data);
      }
    } catch (error) {
      console.error('Failed to fetch pending voters:', error);
      toast.error('Gagal memuat data pemilih');
    }
  };

  const handleVerify = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3001/admin/verify-voter/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        toast.success('Pemilih berhasil diverifikasi');
        fetchPendingVoters(); // Refresh the list
      } else {
        toast.error('Gagal memverifikasi pemilih');
      }
    } catch (error) {
      console.error('Error verifying voter:', error);
      toast.error('Terjadi kesalahan saat memverifikasi pemilih');
    }
  };

  const handleReject = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3001/admin/reject-voter/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        toast.success('Pemilih berhasil ditolak');
        fetchPendingVoters(); // Refresh the list
      } else {
        toast.error('Gagal menolak pemilih');
      }
    } catch (error) {
      console.error('Error rejecting voter:', error);
      toast.error('Terjadi kesalahan saat menolak pemilih');
    }
  };

  const filteredVoters = pendingVoters.filter(voter =>
    voter.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voter.nik.includes(searchTerm)
  );

  return (
    <div className="flex-1 space-y-4 p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Verifikasi Pemilih</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pemilih Menunggu Verifikasi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <Input
              placeholder="Cari berdasarkan nama atau NIK..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NIK</TableHead>
                  <TableHead>Nama Lengkap</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead>No. Telepon</TableHead>
                  <TableHead>Terdaftar</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVoters.map((voter) => (
                  <TableRow key={voter.id}>
                    <TableCell>{voter.nik}</TableCell>
                    <TableCell>{voter.fullName}</TableCell>
                    <TableCell>{voter.address}</TableCell>
                    <TableCell>{voter.phoneNumber}</TableCell>
                    <TableCell>
                      {new Date(voter.createdAt).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleVerify(voter.id)}
                        >
                          Verifikasi
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleReject(voter.id)}
                        >
                          Tolak
                        </Button>
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
  );
} 