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

    // 1️⃣ Cek apakah nomor telepon sudah terdaftar
    const check = await fetch("/api/register/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notelp }),
    });

    const checkData = await check.json();

    if (!check.ok) {
      setLoading(false);
      setResult(`❌ ${checkData.error}`);
      return; // ⬅ STOP di sini, jangan lanjut ke cek kepribadian
    }

    // 2️⃣ Kalau aman → lanjut generate kepribadian
    await new Promise((res) => setTimeout(res, 1200));
    const personality = getPersonality(name.toLowerCase());

    setResult(`✨ Membaca jati diri...`);
    await new Promise((res) => setTimeout(res, 1200));

    setResult(`✨ Kepribadian ${name}: ${personality}`);

    // 3️⃣ Simpan ke database
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, className, notelp, personality }),
    });

    const data = await res.json();

    if (!res.ok) {
      setResult(`❌ ${data.error}`);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#a89bff] via-[#d5d0ff] to-[#f0eeff]">
      <div className="backdrop-blur-xl bg-white/40 border border-white/50 shadow-2xl rounded-3xl p-8 w-full max-w-md animate-fadeIn">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
          Cek Kepribadian
        </h1>
        <p className="text-gray-700 text-center mb-6 text-sm">
          Masukkan data dan temukan jati dirimu ✨
        </p>

        <div className="space-y-4">
          {/* Input Nama */}
          <input
            type="text"
            value={name}
            placeholder="Nama lengkap"
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-xl bg-white text-gray-900 placeholder-gray-400
                       border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none shadow-sm"
          />

          {/* Input Kelas */}
          <input
            type="text"
            value={className}
            placeholder="Kelas"
            onChange={(e) => setClassName(e.target.value)}
            className="w-full p-3 rounded-xl bg-white text-gray-900 placeholder-gray-400
                       border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none shadow-sm"
          />

          {/* Input Nomor Telepon */}
          <input
            type="text"
            value={notelp}
            placeholder="Nomor Telepon"
            onChange={(e) => setNotelp(e.target.value)}
            className="w-full p-3 rounded-xl bg-white text-gray-900 placeholder-gray-400
                       border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none shadow-sm"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white 
                     font-semibold rounded-xl shadow-lg hover:opacity-90 transition active:scale-95 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Memproses..." : "Cek Sekarang"}
        </button>

        {/* Loader */}
        {loading && (
          <div className="mt-4 flex justify-center">
            <div className="loader"></div>
          </div>
        )}

        {/* Hasil */}
        {result && (
          <p
            className="mt-6 bg-white/70 backdrop-blur p-4 rounded-xl border border-purple-200 
                        text-purple-800 text-center animate-pop font-medium shadow"
          >
            {result}
          </p>
        )}
      </div>

      {/* CSS animation */}
      <style>{`
        .loader {
          border: 4px solid #ffffff80;
          border-top: 4px solid #6b46c1;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-fadeIn { animation: fadeIn .7s ease-out; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-pop { animation: pop .35s ease-out; }
        @keyframes pop {
          from { opacity: 0; transform: scale(.85); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
