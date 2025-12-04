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
  const [tooltipId, setTooltipId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollInterval = useRef<NodeJS.Timeout | null>(null);

  const traits = [
    "penyabar","ambisius","percaya diri","pemalu","cerdas","kreatif",
    "romantis","humoris","pemikir","berjiwa pemimpin","setia",
    "visioner","perfeksionis","mudah bergaul","mandiri",
  ];

  const getPersonality = (input: string) => {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      hash = input.charCodeAt(i) + ((hash << 5) - hash);
    }
    return traits[Math.abs(hash % traits.length)];
  };

  // === FUNGSI FILTER KHUSUS UNTUK SETIAP INPUT ===
  const handleNameChange = (val: string) => {
    const cleaned = sanitizeName(val);           // hanya huruf, spasi, titik, strip
    setName(cleaned);
    checkForBadWords(cleaned, val, "nama");
  };

  const handleClassChange = (val: string) => {
    const cleaned = sanitizeName(val);           // sama seperti nama
    setClassName(cleaned);
    checkForBadWords(cleaned, val, "kelas");
  };

  const handleTelpChange = (val: string) => {
    const numbersOnly = val.replace(/[^0-9+]/g, ""); // hanya angka + tanda +
    setNotelp(numbersOnly);
    checkForBadWords(numbersOnly, val, "nomor telepon");
  };

  // Cek apakah ada kata kasar di input mana saja
  const checkForBadWords = (cleaned: string, original: string, field: string) => {
    if (containsBadWord(original)) {
      setWarning(`Kata tidak sopan terdeteksi di ${field}! Harap gunakan bahasa yang baik.`);
    } else if (containsBadWord(name) || containsBadWord(className) || containsBadWord(notelp)) {
      setWarning("Ada kata tidak sopan di salah satu kolom!");
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

    // Final check sebelum submit
    if (containsBadWord(name) || containsBadWord(className) || containsBadWord(notelp)) {
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

      await new Promise(r => setTimeout(r, 1200));
      const personality = getPersonality(name.toLowerCase());

      setResult("Membaca jati diri...");
      await new Promise(r => setTimeout(r, 1200));
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
        const safe = data.map(u => ({
          ...u,
          name: censorText(u.name),
          personality: censorText(u.personality),
        }));
        setUsers(safe);
      } catch {}
    };
    return () => es.close();
  }, []);

  // Auto scroll
  useEffect(() => {
    if (scrollInterval.current) clearInterval(scrollInterval.current);
    scrollInterval.current = setInterval(() => {
      if (scrollRef.current && tooltipId === null) {
        scrollRef.current.scrollTop += 1;
        if (scrollRef.current.scrollTop + scrollRef.current.clientHeight >= scrollRef.current.scrollHeight - 10) {
          scrollRef.current.scrollTop = 0;
        }
      }
    }, 40);
    return () => clearInterval(scrollInterval.current!);
  }, [users, tooltipId]);

  return (
    <div className="min-h-screen p-4 sm:p-10 bg-gradient-to-br from-[#b9ffd6] via-[#e9fff1] to-white flex flex-col lg:flex-row gap-6">
      {/* Form */}
      <div className="flex-1 backdrop-blur-xl bg-white/60 border border-white/50 shadow-lg rounded-3xl p-6 sm:p-8">
        <h1 className="text-3xl font-bold text-green-700 text-center mb-2">Cek Kepribadian</h1>
        <p className="text-green-800 text-center mb-6 text-sm">Masukkan data dan temukan jati dirimu</p>

        <div className="space-y-5">
          {/* Nama Lengkap */}
          <input
            type="text"
            placeholder="Nama lengkap"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full p-3 rounded-xl bg-white text-gray-900 placeholder-gray-500 border border-green-300 focus:ring-2 focus:ring-green-500 focus:outline-none shadow-sm transition"
          />

          {/* Kelas */}
          <input
            type="text"
            placeholder="Kelas (contoh: XII IPA 3)"
            value={className}
            onChange={(e) => handleClassChange(e.target.value)}
            className="w-full p-3 rounded-xl bg-white text-gray-900 placeholder-gray-500 border border-green-300 focus:ring-2 focus:ring-green-500 focus:outline-none shadow-sm transition"
          />

          {/* No Telepon */}
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
      <div className="flex-1 backdrop-blur-xl bg-white/60 border border-white/50 shadow-lg rounded-3xl p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-green-700 text-center mb-4">Leaderboard</h2>
        <div ref={scrollRef} className="flex-1 overflow-hidden space-y-2" style={{ paddingBottom: "100px" }}>
          {users.map(u => (
            <div
              key={u.id}
              onClick={() => setTooltipId(tooltipId === u.id ? null : u.id)}
              className="p-4 bg-green-100/80 rounded-xl text-green-900 font-medium flex justify-between items-center cursor-pointer hover:bg-green-200 transition shadow"
            >
              <span className="truncate max-w-[45%] font-semibold">{u.name}</span>
              <span className="truncate max-w-[45%] italic text-green-700">{u.personality}</span>

              {tooltipId === u.id && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-green-900 text-white rounded-lg p-4 text-sm shadow-2xl z-50 whitespace-nowrap">
                  <div><strong>Nama:</strong> {u.name}</div>
                  <div><strong>Kepribadian:</strong> {u.personality}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}