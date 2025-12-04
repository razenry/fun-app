"use client";

import React, { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  class_name: string;
  notelp: string;
  personality: string;
  created_at: string;
}

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const eventSource = new EventSource("/api/users/stream");

    eventSource.onmessage = (event) => {
      try {
        const data: User[] = JSON.parse(event.data);
        if (search) {
          setUsers(
            data.filter(
              (u) =>
                u.name.toLowerCase().includes(search.toLowerCase()) ||
                u.class_name.toLowerCase().includes(search.toLowerCase()) ||
                u.notelp.includes(search)
            )
          );
        } else {
          setUsers(data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    return () => eventSource.close();
  }, [search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const deleteUser = async (id: number) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus user ini?");
    if (!confirmDelete) return;

    setDeletingId(id);

    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus data");
      setDeletingId(null);
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus data");
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-10 bg-gradient-to-br from-[#b9ffd6] via-[#e9fff1] to-white">
      <div className="max-w-5xl mx-auto backdrop-blur-xl bg-white/40 border border-white/60 shadow-xl rounded-3xl p-4 sm:p-8 animate-fadeIn">
        {/* TITLE */}
        <h1 className="text-2xl sm:text-3xl font-bold text-green-700 mb-2">Admin Dashboard</h1>
        <p className="text-green-800 mb-6 sm:mb-8 text-sm sm:text-base">
          Cari dan kelola user terdaftar
        </p>

        {/* SEARCH BAR */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Cari nama / kelas / no telp..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-3 rounded-xl bg-white text-gray-900 placeholder-gray-500 border border-green-300 focus:ring-2 focus:ring-green-500 focus:outline-none shadow-sm w-full"
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold rounded-xl shadow-lg hover:opacity-90 transition active:scale-95"
          >
            Search
          </button>
        </form>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full rounded-xl overflow-hidden shadow-md min-w-[600px] sm:min-w-full">
            <thead className="bg-white/70 backdrop-blur-xl border-b border-white/60">
              <tr className="text-green-900 font-semibold text-sm sm:text-base">
                <th className="p-2 sm:p-3 text-left">Nama</th>
                <th className="p-2 sm:p-3 text-left">Kelas</th>
                <th className="p-2 sm:p-3 text-left">No Telp</th>
                <th className="p-2 sm:p-3 text-left">Personality</th>
                <th className="p-2 sm:p-3 text-left">Tanggal</th>
                <th className="p-2 sm:p-3 text-left">Aksi</th>
              </tr>
            </thead>

            <tbody className="bg-white/40 text-gray-900 text-sm sm:text-base">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-4 sm:p-6 text-green-800">
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="border-b border-white/40 hover:bg-white/60 transition">
                    <td className="p-2 sm:p-3">{u.name}</td>
                    <td className="p-2 sm:p-3">{u.class_name}</td>
                    <td className="p-2 sm:p-3">{u.notelp}</td>
                    <td className="p-2 sm:p-3">{u.personality}</td>
                    <td className="p-2 sm:p-3">{new Date(u.created_at).toLocaleDateString("id-ID")}</td>
                    <td className="p-2 sm:p-3">
                      <button
                        onClick={() => deleteUser(u.id)}
                        disabled={deletingId === u.id}
                        className="px-3 sm:px-4 py-2 rounded-xl text-white font-semibold shadow bg-gradient-to-r from-red-500 to-red-400 hover:opacity-90 active:scale-95 transition disabled:opacity-50 w-full sm:w-auto"
                      >
                        {deletingId === u.id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ANIMATIONS */}
      <style>{`
        .animate-fadeIn { animation: fadeIn .6s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } }
      `}</style>
    </div>
  );
}
