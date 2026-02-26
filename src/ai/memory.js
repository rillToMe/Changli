const { loadUser, saveUser } = require("./storage")

const MEMORY_TTL = 24 * 60 * 60 * 1000 // 24 jam
const MAX_MEMORY = 8
const SUMMARY_LIMIT = 20

function addMemory(user, role, content) {
  const now = Date.now()
  const data = loadUser(user)

  data.messages.push({
    role,
    content,
    time: now
  })

  saveUser(user, data)
}

function getRecentMemory(user) {
  const now = Date.now()
  const data = loadUser(user)

  const filtered = data.messages.filter(
    m => now - m.time < MEMORY_TTL
  )

  return filtered.slice(-MAX_MEMORY)
}

function getSummary(user) {
  const data = loadUser(user)
  return data.summary || ""
}

function saveSummary(user, text) {
  const data = loadUser(user)
  data.summary = text
  saveUser(user, data)
}

function getAllMemory(user) {
  return loadUser(user)
}


async function compressMemory(user, askGroq) {
  const data = loadUser(user)

  if (data.messages.length < 20) return

  const oldMessages = data.messages.slice(0, 15)

  const summaryPrompt = [
    {
      role: "system",
      content: "Ringkas percakapan berikut menjadi poin-poin penting secara singkat."
    },
    ...oldMessages.map(m => ({
      role: m.role,
      content: m.content
    }))
  ]

  const summaryText = await askGroq(summaryPrompt)

  data.summary = summaryText
  data.messages = data.messages.slice(15)

  saveUser(user, data)
}


module.exports = {
  addMemory,
  getRecentMemory,
  getAllMemory,
  getSummary,
  saveSummary,
  compressMemory
}