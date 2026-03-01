const fs = require("fs")
const path = require("path")


const rawKeys = process.env.MISTRAL_API_KEY
  ? process.env.MISTRAL_API_KEYS.split(",")
  : [process.env.MISTRAL_API_KEY]

const keyPool = rawKeys.map(key => ({
  key: key.trim(),
  cooldownutils: 0
}))

let pointer = 0

function getNextAvailableKey() {
  const now = Date.now()

  for (let i = 0; i < keyPool.length; i++) {
    const index = (pointer + i) % keyPool.length
    const entry = keyPool[index]

    if (entry.cooldownutils <= now) {
      pointer = (index + 1) % keyPool.length
      return entry
    }
  }

  return null
}

async function askMistral(prompt, base64Image, mimeType = "image/jpeg", attempt = 0) {
  const { Mistral } = await import("@mistralai/mistralai")

  if (attempt >= keyPool.length) {
    throw new Error ("All Mistral Key Exhausted.")
  }

  const entry = getNextAvailableKey()
  if (!entry) {
    throw new Error("All Mistral Keys are Cooling Down.")
  }

  const client = new Mistral({
    apiKey: entry.key
  })

 try {
    const res = await client.chat.complete({
      model: "pixtral-12b-2409",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              imageUrl: { url: `data:${mimeType};base64,${base64Image}` }
            },
            {
              type: "text",
              text: prompt || "Deskripsikan gambar ini."
            }
          ]
        }
      ]
    })

    return {
      text: res.choices[0].message.content,
      usage: res.usage || {}
    }

    } catch (err) {
      const status = err.status || err.response?.status

      if (status === 429 || status === 401 || status === 402 || status === 503) {
        console.warn("Mistral key rate-limited or invalid. Cooling down 60s.")
        entry.cooldownUntil = Date.now() + 60000
        return askMistral(prompt, base64Image, mimeType, attempt + 1)
      }

      throw err
    }
}
  

module.exports = { askMistral }