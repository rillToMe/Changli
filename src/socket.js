const pino = require("pino")
const qrcode = require("qrcode-terminal")
const messageHandler = require("./handler")
const logger = require("./utils/logger")

async function startSocket() {
  const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    DisconnectReason
  } = await import("@whiskeysockets/baileys")

  const { Boom } = await import("@hapi/boom")

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

  sock.ev.on("connection.update", ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      logger.info("Scan QR:")
      qrcode.generate(qr, { small: true })
    }

    if (connection === "open") {
      logger.info("Bot connected ✅")
    }

    if (connection === "close") {
      const statusCode = new Boom(lastDisconnect?.error)?.output?.statusCode
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut

      logger.warn(`Connection closed, status: ${statusCode}, reconnect: ${shouldReconnect}`)

      if (shouldReconnect) {
        startSocket()
      }
    }
  })

  sock.ev.on("messages.upsert", (msg) => {
    messageHandler(sock, msg)
  })
}

module.exports = startSocket