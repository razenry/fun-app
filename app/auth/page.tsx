"use client";

import React, { useState } from "react";

export default function AuthPage() {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth", {
      method: "POST",
      body: JSON.stringify({ key }),
    });

    if (res.ok) {
      window.location.href = "/dashboard";
    } else {
      setError("Key salah!");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4
      bg-gradient-to-br from-[#b9ffd6] via-[#e9fff1] to-white"
    >
      <div
        className="backdrop-blur-xl bg-white/40 border border-white/60 
        shadow-2xl rounded-3xl p-8 w-full max-w-md animate-fadeIn"
      >
        {/* Title */}
        <h1 className="text-3xl font-bold text-green-700 text-center mb-2">
          Admin Login
        </h1>

        <p className="text-green-800 text-center mb-6 text-sm">
          Masukkan access key untuk masuk 🔐
        </p>

        {/* Input */}
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Access Key"
          className="w-full p-3 rounded-xl 
          bg-white text-gray-900 placeholder-gray-500 
          border border-green-300 focus:ring-2 focus:ring-green-600 
          focus:outline-none shadow-sm"
        />

        {/* Error */}
        {error && (
          <p
            className="text-red-600 bg-red-100 border border-red-300 
            mt-4 p-2 rounded-lg text-center text-sm"
          >
            {error}
          </p>
        )}

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`mt-6 w-full py-3 
          bg-gradient-to-r from-green-600 to-green-500 
          text-white font-semibold rounded-xl shadow-lg 
          transition active:scale-95 flex items-center justify-center
          ${loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"}`}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Login"
          )}
        </button>
      </div>

      {/* Animation */}
      <style>{`
        .animate-fadeIn {
          animation: fadeIn .6s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
        }
      `}</style>
    </div>
  );
}
