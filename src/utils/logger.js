const pino = require("pino")
const fs = require("fs")

const streams = [
  { stream: process.stdout },
  { stream: fs.createWriteStream("./logs/app.log", { flags: "a" }) }
]

const logger = pino(
  { level: process.env.LOG_LEVEL || "info" },
  pino.multistream(streams)
)

module.exports = logger