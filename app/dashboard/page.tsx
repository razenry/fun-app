"use client";

import React, { useState, useEffect } from "react";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async (q?: string) => {
    setLoading(true);

    const res = await fetch(`/api/users${q ? `?search=${q}` : ""}`);
    const data = await res.json();

    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(search);
  };

  return (
    <div className="min-h-screen p-10 bg-gradient-to-br from-[#a89bff] via-[#d5d0ff] to-[#f0eeff]">
      <div className="max-w-5xl mx-auto backdrop-blur-xl bg-white/30 border border-white/40 shadow-2xl rounded-3xl p-8">

        <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
        <p className="text-gray-800 mb-8">Cari dan kelola user terdaftar.</p>

        {/* SEARCH BAR */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Cari nama / kelas / no telp..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-3 rounded-xl 
            bg-white/90 text-gray-900 placeholder-gray-500 
            border border-purple-200 
            focus:ring-2 focus:ring-purple-500 focus:border-purple-500 
            focus:outline-none shadow-lg"
          />

          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 
            text-white font-semibold rounded-xl shadow-lg hover:opacity-90 
            transition active:scale-95"
          >
            Search
          </button>
        </form>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full rounded-xl overflow-hidden shadow-md">
            <thead className="bg-white/70 backdrop-blur-xl border-b border-white/60">
              <tr className="text-gray-900 font-semibold">
                <th className="p-3 text-left">Nama</th>
                <th className="p-3 text-left">Kelas</th>
                <th className="p-3 text-left">No Telp</th>
                <th className="p-3 text-left">Personality</th>
                <th className="p-3 text-left">Tanggal</th>
              </tr>
            </thead>

            <tbody className="bg-white/40 text-gray-900">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center p-6 text-gray-700">
                    Loading...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-6 text-gray-700">
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              ) : (
                users.map((u: any) => (
                  <tr
                    key={u.id}
                    className="border-b border-white/50 hover:bg-white/60 transition"
                  >
                    <td className="p-3">{u.name}</td>
                    <td className="p-3">{u.class_name}</td>
                    <td className="p-3">{u.notelp}</td>
                    <td className="p-3">{u.personality}</td>
                    <td className="p-3">
                      {new Date(u.created_at).toLocaleDateString("id-ID")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
