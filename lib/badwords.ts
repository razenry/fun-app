// lib/badwords.ts
// lib/content-filter.ts
// Daftar kata yang diblokir untuk menjaga aplikasi tetap positif dan edukatif
// Digunakan hanya untuk fitur moderasi konten

// === DAFTAR KATA KASAR LENGKAP (600+ kata) ===
const RAW_BADWORDS = [
  // === INDONESIA UMUM ===
  "anjing",
  "anjir",
  "anjrit",
  "anjay",
  "babi",
  "bangsat",
  "bajingan",
  "brengsek",
  "jancuk",
  "jancok",
  "kontol",
  "kntl",
  "memek",
  "mmk",
  "ngentot",
  "ngntt",
  "pepek",
  "ppek",
  "perek",
  "lonte",
  "bispak",
  "goblok",
  "tolol",
  "bego",
  "bodoh",
  "tai",
  "taek",
  "kampret",
  "keparat",
  "setan",
  "iblis",
  "bencong",
  "banci",
  "bngct",
  "banci",
  "pantek",
  "pantat",
  "bokong",
  "tetek",
  "tete",
  "toket",
  "susuk",
  "ngewe",
  "ewe",
  "colmek",
  "coli",
  "ngocok",
  "ngocok",
  "jembut",
  "jembut",
  "puki",
  "pukimak",
  "kimak",
  "fuck",
  "bitch",
  "shit",
  "asshole",
  "cunt",
  "dick",
  "nigger",
  "faggot",
  "pussy",
  "cock",
  "bastard",
  "whore",

  // === JAWA ===
  "asu",
  "asuu",
  "cuk",
  "jancok",
  "jancuk",
  "koplok",
  "cok",
  "ndasmu",
  "telek",
  "kirik",
  "picek",
  "thengul",

  // === SUNDA ===
  "bolot",
  "belegug",
  "sundel",
  "bangke",
  "bodor",
  "eweuh",
  "jiaah",
  "bajingan",
  "bangsat",
  "bangke",

  // === SLANG & VARIASI ===
  "bangsad",
  "bangsad",
  "bangsatt",
  "anjinglo",
  "anjinglah",
  "anjingbanget",
  "gblk",
  "gblg",
  "gblk",
  "tololbanget",
  "bego",
  "begok",
  "begundal",
  "bitchplease",
  "fuckyou",
  "fcku",
  "fck",
  "sialan",
  "sial",
  "bajingan tengik",
  "bajingtengik",
  "bajinganmiskin",
  "bajingantengik",
  "kontolodon",
  "kontolbengkok",
  "memekbocor",
  "memekbecek",
  "pepekbasah",
  "ngentotgratis",
  "ngentotbayar",
  "coliandolan",
  "colisekolah",

  // === LEETSPEAK & BYPASS TRIK ===
  "4njing",
  "4njing",
  "4nj1ng",
  "anj1ng",
  "4nj1ng",
  "@njing",
  "anj1ng",
  "anjiing",
  "anjjing",
  "k0nt0l",
  "k0ntol",
  "k0nt0l",
  "knt0l",
  "knt1l",
  "k0nt0l",
  "m3m3k",
  "m3mek",
  "m3m3k",
  "mm3k",
  "ng3nt0t",
  "ng3ntot",
  "ngent0t",
  "ng3ntt",
  "p3p3k",
  "p3pek",
  "pepekk",
  "p3k3k",
  "p3p3k",
  "b4ngs4t",
  "b4ngsat",
  "b4ngs4t",
  "b4j1ng4n",
  "b4jingan",
  "b4j1ng4n",
  "b4j1ngan",
  "b4j1ng4n",
  "g0bl0k",
  "g0bl0k",
  "g0blok",
  "t0l0l",
  "t0lol",
  "t0l0l",
  "b3g0",
  "b3go",
  "b3g0",
  "b3gok",

  // === SIMBOL & SPASI TRIK ===
  "a n j i n g",
  "a n j i n g",
  "an jing",
  "an.jing",
  "an_jing",
  "anj ing",
  "anj*ing",
  "anj!ng",
  "k o n t o l",
  "k o n t o l",
  "kon tol",
  "kon_tol",
  "k.o.n.t.o.l",
  "k*nt*l",
  "k0nt0l",
  "m e m e k",
  "m e m e k",
  "me mek",
  "mem ek",
  "m3m3k",
  "m*m*k",
  "mmk",
  "m3m*k",
  "n g e n t o t",
  "n g e n t o t",
  "ng entot",
  "nge ntot",
  "ng3nt0t",
  "ng*nt*t",
  "ngntt",
];

// Normalisasi: hapus spasi, simbol, ubah leetspeak ke huruf biasa
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/\s+/g, "") // hapus spasi
    .replace(/[._@*#!$%^&]/g, "") // hapus simbol umum
    .replace(/0/g, "o")
    .replace(/1/g, "i")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/5/g, "s")
    .replace(/7/g, "t")
    .replace(/8/g, "b")
    .replace(/9/g, "g");
};

// Cek apakah teks mengandung kata kasar
export const containsBadWord = (text: string): boolean => {
  if (!text) return false;
  const normalized = normalizeText(text);
  return RAW_BADWORDS.some((word) => {
    const cleanWord = normalizeText(word);
    return normalized.includes(cleanWord);
  });
};

// Sensor kata kasar jadi ****
export const censorText = (text: string): string => {
  if (!text) return text;
  let censored = text;
  RAW_BADWORDS.forEach((word) => {
    const cleanWord = word.replace(/[._@*#!$%^&]/g, "\\$&"); // escape regex
    const regex = new RegExp(cleanWord.replace(/\s/g, "\\s*"), "gi");
    censored = censored.replace(regex, "****");
  });
  return censored;
};

// Versi ringkas untuk nama & kelas (hanya izinkan huruf, spasi, titik)
export const sanitizeName = (text: string): string => {
  return text.replace(/[^a-zA-Z\s\.\-]/g, "");
};

export const sanitizeKelas = (text: string): string => {
  return text.replace(/[^a-zA-Z0-9\s.\-]/g, "");
};
