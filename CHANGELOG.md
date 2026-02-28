# Changelog

All notable changes to this project will be documented in this file.

This project follows semantic versioning.

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
  - `.ping`
  - `.help`
  - `.clear`
  - `.memory`
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