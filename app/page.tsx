"use client";
import { useState, useEffect, useRef } from "react";
import { containsBadWord, censorText, sanitizeName } from "@/lib/badwords";

interface User {
  id: number;
  name: string;
  personality: string;
}

export default function Home() {
  const [name, setName] = useState("");
  const [className, setClassName] = useState("");
  const [notelp, setNotelp] = useState("");
  const [result, setResult] = useState("");
  const [warning, setWarning] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [tooltipData, setTooltipData] = useState<User | null>(null); // Ganti dari tooltipId ke data langsung
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollInterval = useRef<NodeJS.Timeout | null>(null);

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

  const handleNameChange = (val: string) => {
    const cleaned = sanitizeName(val); // Hanya huruf, spasi, titik, strip → nama aman
    setName(cleaned);
    checkForBadWords();
  };

  const handleClassChange = (val: string) => {
    // Boleh huruf, angka, spasi, titik, strip, dan slash (contoh: XII/IPS/2)
    const cleaned = val.replace(/[^a-zA-Z0-9\s\.\-\/]/g, "");
    setClassName(cleaned);
    checkForBadWords();
  };

  const handleTelpChange = (val: string) => {
    const numbersOnly = val.replace(/[^0-9+]/g, ""); // Hanya angka + tanda +
    setNotelp(numbersOnly);
    checkForBadWords();
  };

  const checkForBadWords = () => {
    if (
      containsBadWord(name) ||
      containsBadWord(className) ||
      containsBadWord(notelp)
    ) {
      setWarning("Kata tidak sopan terdeteksi! Gunakan bahasa yang baik ya");
    } else {
      setWarning("");
    }
  };

  const handleSubmit = async () => {
    setWarning("");
    if (!name.trim() || !className.trim() || !notelp.trim()) {
      setResult("Semua field wajib diisi");
      return;
    }
    if (
      containsBadWord(name) ||
      containsBadWord(className) ||
      containsBadWord(notelp)
    ) {
      setWarning("Tidak bisa submit! Ada kata tidak sopan.");
      setResult("Gunakan bahasa yang baik dan sopan ya");
      return;
    }

    setLoading(true);
    setResult("Memproses...");

    try {
      const check = await fetch("/api/register/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notelp }),
      });
      const { exists } = await check.json();

      await new Promise((r) => setTimeout(r, 1200));
      const personality = getPersonality(name.toLowerCase());

      setResult("Membaca jati diri...");
      await new Promise((r) => setTimeout(r, 1200));
      setResult(`Anda adalah seorang yang ${personality}`);

      if (!exists) {
        await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: sanitizeName(name),
            className: sanitizeName(className),
            notelp,
            personality: censorText(personality),
          }),
        });
      }
    } catch (err) {
      setResult("Terjadi kesalahan, coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // SSE Leaderboard
  useEffect(() => {
    const es = new EventSource("/api/users/stream");
    es.onmessage = (e) => {
      try {
        const data: User[] = JSON.parse(e.data);
        const safe = data.map((u) => ({
          ...u,
          name: censorText(u.name),
          personality: censorText(u.personality),
        }));
        setUsers(safe);
      } catch {}
    };
    return () => es.close();
  }, []);

  // Auto scroll + pause saat tooltip muncul
  useEffect(() => {
    if (scrollInterval.current) clearInterval(scrollInterval.current);

    if (!tooltipData) {
      scrollInterval.current = setInterval(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop += 1;
          if (
            scrollRef.current.scrollTop + scrollRef.current.clientHeight >=
            scrollRef.current.scrollHeight - 10
          ) {
            scrollRef.current.scrollTop = 0;
          }
        }
      }, 40);
    }
    return () => clearInterval(scrollInterval.current!);
  }, [users, tooltipData]);

  return (
    <>
      <div className="min-h-screen p-4 sm:p-10 bg-gradient-to-br from-[#b9ffd6] via-[#e9fff1] to-white flex flex-col lg:flex-row gap-6">
        {/* Form */}
        <div className="flex-1 backdrop-blur-xl bg-white/60 border border-white/50 shadow-lg rounded-3xl p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-green-700 text-center mb-2">
            Cek Kepribadian
          </h1>
          <p className="text-green-800 text-center mb-6 text-sm">
            Masukkan data dan temukan kepribadian dirimu
          </p>

          <div className="space-y-5">
            <input
              type="text"
              placeholder="Nama lengkap"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full p-3 rounded-xl bg-white text-gray-900 placeholder-gray-500 border border-green-300 focus:ring-2 focus:ring-green-500 focus:outline-none shadow-sm transition"
            />

            <input
              type="text"
              placeholder="Kelas (contoh: XII IPA 3)"
              value={className}
              onChange={(e) => handleClassChange(e.target.value)}
              className="w-full p-3 rounded-xl bg-white text-gray-900 placeholder-gray-500 border border-green-300 focus:ring-2 focus:ring-green-500 focus:outline-none shadow-sm transition"
            />

            <input
              type="text"
              placeholder="Nomor Telepon (contoh: 08123456789)"
              value={notelp}
              onChange={(e) => handleTelpChange(e.target.value)}
              className="w-full p-3 rounded-xl bg-white text-gray-900 placeholder-gray-500 border border-green-300 focus:ring-2 focus:ring-green-500 focus:outline-none shadow-sm transition"
            />
          </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="py-4 px-10 text-lg font-bold bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl shadow-xl hover:shadow-2xl hover:opacity-90 transition active:scale-95 disabled:opacity-50"
            >
              {loading ? "Memproses..." : "Cek Sekarang"}
            </button>
          </div>

          {result && (
            <p className="mt-6 bg-white/80 p-5 rounded-xl border-2 border-green-300 text-green-800 text-center font-semibold shadow-lg">
              {result}
            </p>
          )}

          {warning && (
            <div className="mt-4 bg-red-100 border-2 border-red-400 text-red-700 p-5 rounded-xl text-center font-bold animate-pulse shadow-lg">
              {warning}
            </div>
          )}
        </div>

        {/* Leaderboard */}
        <div className="flex-1 backdrop-blur-xl bg-white/60 border border-white/50 shadow-lg rounded-3xl p-6 flex flex-col relative">
          <h2 className="text-2xl font-bold text-green-700 text-center mb-4">
            Papan Kepribadian
          </h2>
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto space-y-3"
            style={{ paddingBottom: "120px" }}
          >
            {users.map((u) => (
              <div
                key={u.id}
                className="p-4 bg-green-100/80 rounded-xl text-green-900 font-medium flex justify-between items-center cursor-pointer hover:bg-green-200 transition shadow-md"
                onClick={() =>
                  setTooltipData(tooltipData?.id === u.id ? null : u)
                }
              >
                <span className="truncate max-w-[45%] font-semibold">
                  {u.name}
                </span>
                <span className="truncate max-w-[45%] italic text-green-700">
                  {u.personality}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TOOLTIP PORTAL – SELALU DI ATAS SEGALANYA */}
      {tooltipData && (
        <div className="fixed inset-0 pointer-events-none z-[9999]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-800 text-white rounded-xl px-6 py-5 shadow-2xl border-4 border-green-600">
            <div className="font-bold text-green-200 text-lg mb-2">Detail</div>
            <div className="text-sm space-y-1">
              <div>
                <strong>Nama:</strong> {tooltipData.name}
              </div>
              <div>
                <strong>Kepribadian:</strong> {tooltipData.personality}
              </div>
            </div>
            {/* Tombol close */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setTooltipData(null);
              }}
              className="absolute top-2 right-3 text-green-200 hover:text-white text-xl font-bold"
            >
              ×
            </button>
          </div>
          {/* Klik di luar untuk tutup */}
          <div
            className="absolute inset-0 bg-black/20 pointer-events-auto"
            onClick={() => setTooltipData(null)}
          />
        </div>
      )}

      {/* Animasi */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
}
