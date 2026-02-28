const pino = require("pino")
const fs = require("fs")
const path = require("path")

const logDir = path.join(__dirname, "../logs")
const logFile = path.join(logDir, "app.log")

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true })
}

if (!fs.existsSync(logFile)) {
  fs.writeFileSync(logFile, "")
}

const streams = [
  { stream: process.stdout },
  { stream: fs.createWriteStream(logFile, { flags: "a" }) }
]

const logger = pino(
  { level: process.env.LOG_LEVEL || "info" },
  pino.multistream(streams)
)

module.exports = logger