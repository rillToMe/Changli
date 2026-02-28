# Changli AI WhatsApp Bot

Changli adalah AI-powered WhatsApp bot berbasis Baileys v7 dengan arsitektur modular, middleware chain, memory system, multi-key Groq fallback, dan admin dashboard.

Bot ini dirancang untuk grup kecil dengan fokus pada:
- AI personality (smart + calm + motherly tone)
- Modular command system
- Middleware architecture
- Per-user memory
- Multi API key rotation
- Token usage monitoring
- Mini utility commands

---

## 🚀 Features

### Core AI
- Groq LLM integration
- Multi API key rotation
- Smart context builder
- Memory per user
- Context compression
- AI fallback middleware
- Explicit `.ai` mode

### Command System
- Auto command loader
- Permission system (public / admin / group / private)
- Cooldown system
- Middleware chain
- Command isolation (tidak masuk memory AI)

### Mini Utilities
- `.ping`
- `.memory`
- `.clear`
- `.help`
- Extendable command structure

### Logging
- Pino logger
- Auto-create logs folder
- Multistream (console + file)
- Safe Linux deployment

### Admin Dashboard
- Express server
- Login system
- Token usage chart
- System monitoring
- Manual refresh

---

## 📁 Project Structure

```
Changli/
│
├── index.js
├── handler.js
├── socket.js
│
├── auth/
├── logs/
├── data/
│
├── src/
│   ├── ai/
│   │   ├── groqClient.js
│   │   ├── memory.js
│   │   ├── storage.js
│   │   └── contextBuilder.js
│   │
│   ├── commands/
│   │   ├── ping.js
│   │   ├── help.js
│   │   ├── clear.js
│   │   └── memory.js
│   │
│   ├── middleware/
│   │   ├── permission.js
│   │   ├── cooldown.js
│   │   ├── aiFallback.js
│   │   └── index.js
│   │
│   ├── utils/
│   │   ├── logger.js
│   │   └── cooldown.js
│   │
│   └── config/
│       └── access.js
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

GROQ_MODEL=llama-3.1-70b-versatile
GROQ_API_KEYS=key1,key2,key3

```

---

## ▶️ Run Bot

```bash
node index.js
```

Scan QR dari terminal untuk login WhatsApp.

---

## 🧠 AI Flow

1. Message received
2. Prefix validation
3. Command lookup
4. Middleware chain:
   - Permission
   - Cooldown
   - AI fallback
5. Context building
6. Groq call
7. Memory update
8. Usage logging

---

## 🔐 Middleware Architecture

Semua pesan melewati:

```
Permission → Cooldown → AI Fallback → Command Execute
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
- Smart compression
- JSON persistence
- Command tidak masuk memory AI

---

## 🔁 Multi Key Rotation

Jika terjadi:
- 429 (rate limit)
- 401 (invalid key)
- 402 (quota issue)
- 503 (service issue)

System akan:
- Cooldown key
- Switch ke key berikutnya
- Retry otomatis

---

## ⚠️ Requirements

- Node.js 20+
- Baileys v7.x
- Internet stabil
- WhatsApp account aktif

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

---

## 📄 License

Private / Internal Use