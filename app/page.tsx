"use client";
import { useState, useEffect, useRef } from "react";

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
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [tooltipId, setTooltipId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollInterval = useRef<ReturnType<typeof setInterval> | null>(null);

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

  const handleSubmit = async () => {
    if (!name || !className || !notelp) {
      setResult("Semua field wajib diisi 😅");
      return;
    }

    setLoading(true);
    setResult("");

    const check = await fetch("/api/register/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notelp }),
    });
    const checkData = await check.json();
    const isRegistered = checkData.exists === true;

    await new Promise((res) => setTimeout(res, 1200));
    const personality = getPersonality(name.toLowerCase());

    setResult(`✨ Membaca jati diri...`);
    await new Promise((res) => setTimeout(res, 1200));
    setResult(`✨ Kepribadian ${name}: ${personality}`);

    if (!isRegistered) {
      await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, className, notelp, personality }),
      });
    }

    setLoading(false);
  };

  // SSE untuk leaderboard realtime
  useEffect(() => {
    const eventSource = new EventSource("/api/users/stream");
    eventSource.onmessage = (event) => {
      try {
        const data: User[] = JSON.parse(event.data);
        setUsers(data);
      } catch (err) {
        console.error(err);
      }
    };
    return () => eventSource.close();
  }, []);

  // Auto scroll vertikal leaderboard
  useEffect(() => {
    if (scrollInterval.current) clearInterval(scrollInterval.current);

    scrollInterval.current = setInterval(() => {
      if (scrollRef.current && tooltipId === null) {
        scrollRef.current.scrollTop += 1;
        if (
          scrollRef.current.scrollTop + scrollRef.current.clientHeight >=
          scrollRef.current.scrollHeight
        ) {
          scrollRef.current.scrollTop = 0;
        }
      }
    }, 50);

    return () => {
      if (scrollInterval.current) clearInterval(scrollInterval.current);
    };
  }, [users, tooltipId]);

  return (
    <div className="min-h-screen p-4 sm:p-10 bg-gradient-to-br from-[#b9ffd6] via-[#e9fff1] to-white flex flex-col lg:flex-row gap-6">
      {/* LEFT SECTION - Form */}
      <div className="flex-1 backdrop-blur-xl bg-white/60 border border-white/50 shadow-lg rounded-3xl p-6 sm:p-8 animate-fadeIn">
        <h1 className="text-3xl font-bold text-green-700 text-center mb-2">
          Cek Kepribadian
        </h1>
        <p className="text-green-800 text-center mb-6 text-sm">
          Masukkan data dan temukan jati dirimu ✨
        </p>

        <div className="space-y-4">
          {["Nama lengkap","Kelas","Nomor Telepon"].map((placeholder, idx) => {
            const value = [name,className,notelp][idx];
            const setter = [setName,setClassName,setNotelp][idx];
            return (
              <input
                key={idx}
                type="text"
                value={value}
                placeholder={placeholder}
                onChange={(e) => setter(e.target.value)}
                className="w-full p-3 rounded-xl bg-white text-gray-900 placeholder-gray-500
                           border border-green-300 focus:ring-2 focus:ring-green-500 
                           focus:outline-none shadow-sm transition"
              />
            );
          })}
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="py-3 px-6 text-base sm:text-lg
                       bg-gradient-to-r from-green-600 to-green-500 text-white
                       font-semibold rounded-xl shadow-lg hover:opacity-90
                       transition active:scale-95 disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Cek Sekarang"}
          </button>
        </div>

        {result && (
          <p className="mt-6 bg-white/70 p-4 rounded-xl border border-green-200 
                        text-green-800 text-center animate-pop font-medium shadow">
            {result}
          </p>
        )}
      </div>

      {/* RIGHT SECTION - Leaderboard */}
      <div className="flex-1 backdrop-blur-xl bg-white/60 border border-white/50 shadow-lg rounded-3xl p-4 sm:p-6 animate-fadeIn flex flex-col">
        <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">
          Leaderboard
        </h2>
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-2 relative"
          style={{ paddingBottom: "100px" }} // pastikan data bawah tidak ketutupan
        >
          {users.map((u) => (
            <div
              key={u.id}
              className="p-3 bg-green-100/70 rounded-xl text-green-900 font-medium flex justify-between items-center animate-slideIn relative cursor-pointer"
              onClick={() => setTooltipId(tooltipId === u.id ? null : u.id)}
            >
              <span className="truncate max-w-[45%]">{u.name}</span>
              <span className="truncate max-w-[45%] italic">{u.personality}</span>

              {/* Tooltip untuk mobile touch */}
              {tooltipId === u.id && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 bg-green-200 text-green-900 rounded-lg p-2 text-sm shadow-lg z-10 w-max min-w-[150px] text-center">
                  <div><strong>Nama:</strong> {u.name}</div>
                  <div><strong>Personality:</strong> {u.personality}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .animate-fadeIn { animation: fadeIn .7s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px);} }
        .animate-pop { animation: pop .35s ease-out; }
        @keyframes pop { from { opacity: 0; transform: scale(.85);} }
        .animate-slideIn { animation: slideIn .5s ease-out; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(10px);} }
      `}</style>
    </div>
  );
}
