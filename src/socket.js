const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore
} = require("@whiskeysockets/baileys")

const pino = require("pino")
const qrcode = require("qrcode-terminal")
const messageHandler = require("./handler")
const logger = require("./utils/logger")

async function startSocket() {
  const { state, saveCreds } = await useMultiFileAuthState("auth")
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    version,
    logger: pino({ level: "silent" }),
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" }))
    },
    browser: ["Ubuntu", "Chrome", "120.0.0"]
  })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("connection.update", ({ connection, qr }) => {
    if (qr) {
      logger.info("Scan QR:")
      qrcode.generate(qr, { small: true })
    }

    if (connection === "open") {
      logger.info("Bot connected ✅")
    }

    if (connection === "close") {
      logger.warn("Connection closed")
    }
  })

  sock.ev.on("messages.upsert", (msg) => {
    messageHandler(sock, msg)
  })
}

module.exports = startSocket