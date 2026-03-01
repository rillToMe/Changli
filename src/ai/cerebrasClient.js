const Cerebras = require("@cerebras/cerebras_cloud_sdk")

const rawKeys = process.env.CEREBRAS_API_KEYS
  ? process.env.CEREBRAS_API_KEYS.split(",")
  : [process.env.CEREBRAS_API_KEY]

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

async function askCerebras(messages, attempt = 0) {
  if (attempt >= keyPool.length) {
    throw new Error("All Cerebras keys exhausted.")
  }

  const entry = getNextAvailableKey()
  if (!entry) {
    throw new Error("All Cerebras keys are cooling down.")
  }

  const client = new Cerebras({ apiKey: entry.key })

  try {
    const res = await client.chat.completions.create({
      model: process.env.CEREBRAS_MODEL || "gpt-oss-120b",
      messages,
      temperature: 0.7,
      max_completion_tokens: 1024
    })

    return {
      text: res.choices[0].message.content,
      usage: res.usage || {}
    }

  } catch (err) {
    const status = err.status || err.response?.status

    if (status === 429 || status === 401 || status === 402 || status === 503) {
      console.warn("Cerebras key rate-limited or invalid. Cooling down 60s.")
      entry.cooldownUntil = Date.now() + 60000
      return askCerebras(messages, attempt + 1)
    }

    throw err
  }
}

module.exports = { askCerebras }