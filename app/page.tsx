"use client";
import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [className, setClassName] = useState("");
  const [notelp, setNotelp] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const traits = [
    "penyabar",
    "ambisius",
    "percaya diri",
    "pemalu",
    "cerdas",
    "kreatif",
    "romantis",
    "humoris",
    "pemikir",
    "berjiwa pemimpin",
    "setia",
    "visioner",
    "perfeksionis",
    "mudah bergaul",
    "mandiri",
  ];

  const getPersonality = (input: string) => {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      hash = input.charCodeAt(i) + ((hash << 5) - hash);
    }
    return traits[Math.abs(hash % traits.length)];
  };

  const handleSubmit = async () => {
    if (!name || !className || !notelp) {
      setResult("Semua field wajib diisi 😅");
      return;
    }

    setLoading(true);
    setResult("");

    // ⬅ cek apakah nomor telp sudah ada
    const check = await fetch("/api/register/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notelp }),
    });

    const checkData = await check.json();
    const isRegistered = checkData.exists === true;

    // 1️⃣ Generate personality dulu (baik sudah terdaftar atau belum)
    await new Promise((res) => setTimeout(res, 1200));
    const personality = getPersonality(name.toLowerCase());

    setResult(`✨ Membaca jati diri...`);
    await new Promise((res) => setTimeout(res, 1200));

    setResult(`✨ Kepribadian ${name}: ${personality}`);

    // 2️⃣ Jika nomor BELUM terdaftar → simpan ke DB
    if (!isRegistered) {
      await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, className, notelp, personality }),
      });
    }

    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 
                    bg-gradient-to-br from-[#b9ffd6] via-[#e9fff1] to-white"
    >
      <div
        className="backdrop-blur-xl bg-white/50 border border-white/70 
                      shadow-xl rounded-3xl p-8 w-full max-w-md animate-fadeIn"
      >
        <h1 className="text-3xl font-bold text-green-700 text-center mb-2">
          Cek Kepribadian
        </h1>
        <p className="text-green-800 text-center mb-6 text-sm">
          Masukkan data dan temukan jati dirimu ✨
        </p>

        <div className="space-y-4">
          <input
            type="text"
            value={name}
            placeholder="Nama lengkap"
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-xl bg-white text-gray-900 placeholder-gray-500
                       border border-green-300 focus:ring-2 focus:ring-green-500 
                       focus:outline-none shadow-sm"
          />

          <input
            type="text"
            value={className}
            placeholder="Kelas"
            onChange={(e) => setClassName(e.target.value)}
            className="w-full p-3 rounded-xl bg-white text-gray-900 placeholder-gray-500
                       border border-green-300 focus:ring-2 focus:ring-green-500 
                       focus:outline-none shadow-sm"
          />

          <input
            type="text"
            value={notelp}
            placeholder="Nomor Telepon"
            onChange={(e) => setNotelp(e.target.value)}
            className="w-full p-3 rounded-xl bg-white text-gray-900 placeholder-gray-500
                       border border-green-300 focus:ring-2 focus:ring-green-500 
                       focus:outline-none shadow-sm"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-6 w-full py-3 bg-gradient-to-r from-green-600 to-green-500 
                     text-white font-semibold rounded-xl shadow-lg hover:opacity-90 
                     transition active:scale-95 disabled:opacity-50"
        >
          {loading ? "Memproses..." : "Cek Sekarang"}
        </button>

        {result && (
          <p
            className="mt-6 bg-white/70 p-4 rounded-xl border border-green-200 
                        text-green-800 text-center animate-pop font-medium shadow"
          >
            {result}
          </p>
        )}
      </div>

      <style>{`
        .animate-fadeIn { animation: fadeIn .7s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px);} }
        .animate-pop { animation: pop .35s ease-out; }
        @keyframes pop { from { opacity: 0; transform: scale(.85);} }
      `}</style>
    </div>
  );
}
