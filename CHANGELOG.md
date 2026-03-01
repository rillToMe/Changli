# Changelog

All notable changes to this project will be documented in this file.

This project follows semantic versioning.

---

## [1.1.0] - 2026-03-01

### Added
- **Image Analysis** - Mistral vision integration. User kirim gambar + caption `.ai <pertanyaan>` langsung dianalisis. Support kirim langsung maupun reply gambar.
- **YouTube Transcript Summarizer** - Command `.ai yt-rs <url>` untuk meringkas video YouTube via Supadata API + Cerebras LLM.
- **Cerebras LLM Integration** - Provider AI baru khusus untuk summarize teks panjang (`gpt-oss-120b`). Lebih cepat dan hemat Groq quota untuk task berat.
- **Mistral Multi Key Rotation** - Sistem key rotation untuk Mistral, identik dengan Groq. Support 1 atau banyak key via `MISTRAL_API_KEYS`.
- **Cerebras Multi Key Rotation** - Sistem key rotation untuk Cerebras via `CEREBRAS_API_KEYS`.
- **Quoted Message Context** - Bot sekarang bisa membaca isi pesan yang di-reply user dan menyertakannya sebagai konteks ke AI.
- **Reminder System** - Command `.ai remind <waktu> <pesan>`. Support satuan `s`, `m`, `h`, `d`. Maksimal 7 hari.
- **Command Description & Usage** - Field `description` dan `usage` ditambahkan ke setiap command untuk tampilan `.ai help` yang lebih informatif.

### Improved
- `.ai help` - Sekarang menampilkan deskripsi dan contoh penggunaan tiap command.
- `aiFallback.js` - Routing otomatis: pesan dengan gambar dikirim ke Mistral, pesan biasa tetap ke Groq.
- `socket.js` - Migrasi dari `require()` ke `await import()` untuk kompatibilitas Baileys v7 ESM tanpa perlu convert seluruh project ke ESM.
- `socket.js` - Tambah reconnect logic dengan `DisconnectReason` agar bot auto-reconnect saat koneksi terputus.
- `index.js` - Tambah `process.env.PREFIX.trim()` untuk mencegah bug CRLF line ending di Linux server.

### Fixed
- Bug koneksi Baileys v7 akibat CommonJS vs ESM conflict.
- Bug command tidak ter-trigger di Linux server akibat CRLF pada `.env`.
- Bug `msg` tidak ter-destructure di `aiFallback.js` menyebabkan `ReferenceError`.
- Bug pesan dengan image melewati `if (!text) return` sehingga tidak pernah diproses.

### Dependencies Added
- `@mistralai/mistral` - Mistral vision API
- `@cerebras/cerebras_cloud_sdk` - Cerebras LLM
- `@supadata/js` - YouTube transcript API

---

## [1.0.0] - Initial Public Release

### Added
- Baileys v7 WhatsApp integration
- QR authentication flow
- Modular command system
- Middleware architecture (permission, cooldown, AI fallback)
- Groq LLM integration
- Multi API key rotation
- Per-user memory system
- Smart context builder
- Command isolation (commands do not pollute AI memory)
- Mini utility commands:
  - `.ai ping`
  - `.ai help`
  - `.ai clear`
  - `.ai memory`
- Pino logging (console + file)
- Auto-create logs directory

### AI Features
- Smart + calm personality system
- Explicit `.ai` mode
- Context filtering
- Token usage tracking
- Automatic key cooldown and retry

### Security
- Admin whitelist
- Group restriction support
- Permission-based command access
- Cooldown anti-spam system

### Stability
- Clean socket handling
- Safe memory persistence
- JSON corruption handling
- Linux and Windows compatibility

---

## Pre-Release Development

Prior to v1.0.0:
- Experimental AI integration
- Early memory implementation
- Handshake debugging
- Middleware refactor
- Multi-key fallback implementation
- Stability improvements