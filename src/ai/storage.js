const fs = require("fs")
const path = require("path")

const DATA_DIR = path.join(__dirname, "../../data")

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR)
}

function getUserFile(user) {
  return path.join(DATA_DIR, `${user}.json`)
}

function loadUser(user) {
  const file = getUserFile(user)

  if (!fs.existsSync(file)) {
    return { messages: [], summary: "" }
  }

  const raw = JSON.parse(fs.readFileSync(file, "utf-8"))

  // 🔥 MIGRATION LOGIC
  if (Array.isArray(raw)) {
    return {
      messages: raw,
      summary: ""
    }
  }

  if (!raw.messages) {
    return {
      messages: [],
      summary: ""
    }
  }

  return raw
}

function saveUser(user, data) {
  const file = getUserFile(user)
  fs.writeFileSync(file, JSON.stringify(data, null, 2))
}

module.exports = {
  loadUser,
  saveUser
}