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

interface User {
  id: string;
  nik: string;
  fullName: string;
  address: string;
  phoneNumber: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function VotersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched users:', data); // Debug log
        setUsers(data);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Gagal memuat data pengguna');
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Gagal memuat data pengguna');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('Pengguna berhasil dihapus');
        fetchUsers(); // Refresh the list
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Gagal menghapus pengguna');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Terjadi kesalahan saat menghapus pengguna');
    }
  };

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.nik.includes(searchTerm)
  );

  return (
    <div className="flex-1 space-y-4 p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Kelola Pengguna</h1>
        <Button>Tambah Pengguna</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengguna</CardTitle>
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
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Terdaftar</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      Memuat data...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      Tidak ada data pengguna
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.nik}</TableCell>
                      <TableCell>{user.fullName}</TableCell>
                      <TableCell>{user.address}</TableCell>
                      <TableCell>{user.phoneNumber}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.role === 'ADMIN' 
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {user.role}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.isVerified 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {user.isVerified ? 'Terverifikasi' : 'Belum Verifikasi'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString('id-ID')}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            Hapus
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 