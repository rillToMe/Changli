const systemPrompt = require("./systemPrompt")
const { getRecentMemory, getSummary} = require("./memory")

function buildContext(user, prompt) {
  const now = new Date().toLocaleString("id-ID")

  const history = getRecentMemory(user)
  const summary = getSummary(user)

  const messages = [
    {
      role: "system",
      content: `${systemPrompt}\n\nWaktu sekarang: ${now}`
    }
  ]

  if (summary) {
    messages.push({
      role: "system",
      content: `Ringkasan percakapan sebelumnya:\n${summary}`
    })
  }

  messages.push(
    ...history.map(m => ({
      role: m.role,
      content: m.content
    }))
  )

  messages.push({
    role: "user",
    content: prompt
  })

  return messages
}

module.exports = {
  buildContext
}