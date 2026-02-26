const Groq = require("groq-sdk").default

const rawKeys = process.env.GROQ_API_KEYS.split(",")


const keyPool = rawKeys.map(key => ({
  key: key.trim(),
  cooldownUntil: 0
}))

let pointer = 0

function getNextAvailableKey() {
  const now = Date.now()

  for (let i = 0; i < keyPool.length; i++) {
    const index = (pointer + i) % keyPool.length
    const entry = keyPool[index]

    if (entry.cooldownUntil <= now) {
      pointer = (index + 1) % keyPool.length
      return entry
    }
  }

  return null
}

async function askGroq(messages, attempt = 0) {
    if (attempt >= keyPool.length) {
        throw new Error("All Groq keys exhausted.")
    }

    const entry = getNextAvailableKey()

    if (!entry) {
        throw new Error("All Groq keys are cooling down.")
    }

    const client = new Groq({
        apiKey: entry.key
    })

    try {
        const res = await client.chat.completions.create({
            model: process.env.GROQ_MODEL,
            messages,
            temperature: 0.7,
            max_tokens: 500
        })

        return res.choices[0].message.content

    } catch (err) {
        const status = err.status || err.response?.status

        if (status === 429 || status === 401 || status === 402 || status === 503) {
            console.warn("Key rate-limited or invalid. Cooling down 60s.")
            entry.cooldownUntil = Date.now() + 60000
            return askGroq(messages)
        }

        throw err
    }
}

module.exports = { askGroq }