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

  try {
    const raw = fs.readFileSync(file, "utf-8")

    if (!raw || raw.trim() === "") {
      return { messages: [], summary: "" }
    }

    const parsed = JSON.parse(raw)

    // Migration logic
    if (Array.isArray(parsed)) {
      return {
        messages: parsed,
        summary: ""
      }
    }

    if (!parsed.messages) {
      return {
        messages: [],
        summary: ""
      }
    }

    return parsed

  } catch (err) {
    console.warn("Memory corrupted, resetting:", user)
    return { messages: [], summary: "" }
  }
}

function saveUser(user, data) {
  const file = getUserFile(user)
  fs.writeFileSync(file, JSON.stringify(data, null, 2))
}

module.exports = {
  loadUser,
  saveUser
}