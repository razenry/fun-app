"use client";

import React, { useState } from "react";

export default function AuthPage() {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    const res = await fetch("/api/auth", {
      method: "POST",
      body: JSON.stringify({ key }),
    });

    if (res.ok) {
      window.location.href = "/dashboard";
    } else {
      setError("Key salah!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#a89bff] via-[#d5d0ff] to-[#f0eeff]">
      <div className="backdrop-blur-xl bg-white/40 border border-white/50 shadow-2xl rounded-3xl p-8 w-full max-w-md animate-fadeIn">
        
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
          Login Akses
        </h1>

        <p className="text-gray-700 text-center mb-6 text-sm">
          Masukkan akses key untuk masuk 🔐
        </p>

        {/* Input */}
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Access Key"
          className="w-full p-3 rounded-xl bg-white text-gray-900 placeholder-gray-400
          border border-gray-300 focus:ring-2 focus:ring-purple-500 
          focus:border-purple-500 focus:outline-none shadow-sm"
        />

        {/* Error message */}
        {error && (
          <p className="text-red-600 bg-red-100 border border-red-300 mt-4 p-2 rounded-lg text-center text-sm">
            {error}
          </p>
        )}

        {/* Button */}
        <button
          onClick={handleLogin}
          className="mt-6 w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white 
          font-semibold rounded-xl shadow-lg hover:opacity-90 transition active:scale-95"
        >
          Login
        </button>

      </div>

      <style>{`
        .animate-fadeIn { animation: fadeIn .7s ease-out; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
