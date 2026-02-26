const fs = require("fs")
const MEMORY_FILE = "./memory.json"
const logger = require("../utils/logger")

function load() {
  if (!fs.existsSync(MEMORY_FILE)) return {}
  return JSON.parse(fs.readFileSync(MEMORY_FILE))
}

function save(data) {
  fs.writeFileSync(MEMORY_FILE, JSON.stringify(data, null, 2))
}

function add(userId, message) {
  const db = load()

  if (!db[userId]) db[userId] = []

  db[userId].push(message)

  if (db[userId].length > 10) {
    db[userId] = db[userId].slice(-10)
  }

  logger.debug(`Memory update for ${userId}`)

  save(db)
}

module.exports = { add, load }