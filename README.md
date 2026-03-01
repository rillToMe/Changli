# Changli AI WhatsApp Bot

Changli adalah AI-powered WhatsApp bot berbasis Baileys v7 dengan arsitektur modular, middleware chain, memory system, multi-key rotation, dan multi-provider AI.

Bot ini dirancang untuk grup kecil dengan fokus pada:
- AI personality (smart + calm + motherly tone)
- Modular command system
- Middleware architecture
- Per-user memory
- Multi API key rotation (Groq, Mistral, Cerebras)
- Token usage monitoring
- Image analysis
- YouTube transcript summarizer
- Reminder system

---

## 🚀 Features

### Core AI
- Groq LLM integration (chat utama)
- Cerebras integration (summarize teks panjang)
- Mistral integration (image/vision analysis)
- Multi API key rotation per provider
- Smart context builder
- Memory per user
- Context compression
- AI fallback middleware
- Quoted message context (bot baca isi pesan yang di-reply)

### Command System
- Auto command loader
- Permission system (public / admin / group / private)
- Cooldown system (global + per command)
- Middleware chain
- Command isolation (tidak masuk memory AI)

### Commands
- `.ai ping` - Cek status dan latency bot
- `.ai help` - Tampilkan daftar command beserta deskripsi
- `.ai memory` - Lihat isi memory percakapan AI
- `.ai clear` - Hapus memory percakapan AI
- `.ai yt-ts <url>` - Ringkas video YouTube dari transcript (via Supadata + Cerebras)
- `.ai remind <waktu> <pesan>` - Set reminder (format: 30s / 10m / 2h / 1d)

### Image Analysis
- User kirim gambar + caption `.ai <pertanyaan>` → diproses Mistral vision
- Support reply gambar + tanya ke bot
- Fallback ke Groq jika tidak ada gambar

### Logging
- Pino logger
- Auto-create logs folder
- Multistream (console + file)
- Safe Linux deployment

---

## 📁 Project Structure

```
Changli/
│
├── index.js
├── .env
│
├── auth/
├── logs/
├── data/
│
└── src/
    ├── socket.js
    ├── handler.js
    │
    ├── ai/
    │   ├── groqClient.js
    │   ├── mistralClient.js
    │   ├── cerebrasClient.js
    │   ├── contextBuilder.js
    │   ├── memory.js
    │   ├── systemPrompt.js
    │   ├── knowledgeRetriever.js
    │   ├── knowledge.json
    │   └── usage.js
    │
    ├── commands/
    │   ├── index.js
    │   ├── ping.js
    │   ├── help.js
    │   ├── memory.js
    │   ├── clear.js
    │   ├── yt-ts.js
    │   └── remind.js
    │
    ├── middleware/
    │   ├── index.js
    │   ├── permission.js
    │   ├── cooldown.js
    │   └── aiFallback.js
    │
    ├── utils/
    │   ├── logger.js
    │   └── cooldown.js
    │
    └── config/
        └── access.js
```

---

## ⚙️ Installation

```bash
git clone https://github.com/rillToMe/Changli
cd Changli
npm install
```

---

## 🛠 Environment Variables

Buat file `.env` di root project:

```
PREFIX=.ai
LOG_LEVEL=info

ADMIN_LID=your_admin_lid
ALLOWED_GROUP=group_id@g.us

# Groq (chat utama)
GROQ_MODEL=llama-3.1-70b-versatile
GROQ_API_KEYS=key1,key2,key3,key4

# Mistral (image analysis)
MISTRAL_API_KEYS=key1,key2

# Cerebras (summarize panjang)
CEREBRAS_MODEL=gpt-oss-120b
CEREBRAS_API_KEYS=key1,key2

# Supadata (YouTube transcript)
SUPADATA_API_KEY=sd_xxxxxxxxxxxx
```

---

## ▶️ Run Bot

```bash
node index.js
```

Scan QR dari terminal untuk login WhatsApp.

---

## 🧠 AI Flow

### Chat biasa:
1. Message received
2. Prefix validation
3. Command lookup
4. Middleware chain (Permission → Cooldown → Command/AI Fallback)
5. Cek quoted message context
6. Context building + memory
7. Groq call
8. Memory update + usage logging

### Image input:
1. Message dengan imageMessage terdeteksi
2. Download image → base64
3. Kirim ke Mistral vision
4. Balas hasil analisis

### YouTube summarize:
1. `.ai yt-ts <url>` diterima
2. Extract video ID dari URL
3. Fetch transcript via Supadata API
4. Transcript dikirim ke Cerebras untuk diringkas
5. Kirim ringkasan ke chat

---

## 🔐 Middleware Architecture

Semua pesan melewati:

```
Permission → Cooldown → Command Execute → AI Fallback
```

Keuntungan:
- Modular
- Clean separation
- Mudah debug
- Mudah tambah fitur baru

---

## 🧠 Memory System

- Per user storage
- TTL filtering
- Smart compression via Groq
- JSON persistence
- Command tidak masuk memory AI
- Quoted message context otomatis dimasukkan ke prompt

---

## 🔁 Multi Key Rotation

Berlaku untuk Groq, Mistral, dan Cerebras. Jika terjadi:
- 429 (rate limit)
- 401 (invalid key)
- 402 (quota issue)
- 503 (service issue)

System akan:
- Cooldown key selama 60 detik
- Switch ke key berikutnya
- Retry otomatis
- Throw error jika semua key exhausted

---

## ⏰ Reminder System

- Format: `.ai remind <waktu> <pesan>`
- Satuan waktu: `s` (detik), `m` (menit), `h` (jam), `d` (hari)
- Maksimal 7 hari
- In-memory (hilang jika bot restart)
- Contoh: `.ai remind 30m beli susu`

---

## ⚠️ Requirements

- Node.js 20+
- Baileys v7.x
- Internet stabil
- WhatsApp account aktif

### NPM Packages
- `@whiskeysockets/baileys` - WhatsApp connection
- `@mistralai/mistral` - Mistral vision API
- `@cerebras/cerebras_cloud_sdk` - Cerebras LLM
- `groq-sdk` - Groq LLM
- `@supadata/js` - YouTube transcript
- `pino` - Logging
- `dotenv` - Environment variables

---

## 👑 Personality

Changli AI memiliki karakter:
- Smart
- Calm
- Slightly confident
- Professional when serious
- Witty when casual
- Tidak berlebihan
- Tidak membahas adult topic

---

## 📌 Roadmap (Future)

- Spam detection system
- Advanced tone classifier
- Plugin system
- Voice input support
- Real-time dashboard update
- Advanced RAG system
- Persistent reminder (survive restart)
- Web search integration

---

## 📄 License

Private / Internal Use