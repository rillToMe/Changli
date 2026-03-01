const { buildContext } = require("../ai/contextBuilder")
const { addMemory, compressMemory } = require("../ai/memory")
const { askGroq } = require("../ai/groqClient")
const { askMistral } = require("../ai/mistralClient")
const { logUsage } = require("../ai/usage")

async function downloadImage(sock, msg) {
  const { downloadMediaMessage } = await import("@whiskeysockets/baileys")
  const buffer = await downloadMediaMessage(msg, "buffer", {})
  return buffer.toString("base64")
}

module.exports = async function aiFallbackMiddleware(ctx) {
  const { sock, jid, participant, prompt, quotedText, msg } = ctx

  try {
    const directImage = msg.message?.imageMessage
    const quotedImage =
      msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage

    const imageMessage = directImage || quotedImage
    const targetMsg = directImage
      ? msg
      : {
          ...msg,
          message: msg.message?.extendedTextMessage?.contextInfo?.quotedMessage,
          key: {
            ...msg.key,
            id: msg.message?.extendedTextMessage?.contextInfo?.stanzaId,
            remoteJid: jid
          }
        }

    if (imageMessage) {

      const mimeType = imageMessage.mimetype || "image/jpeg"
      const base64 = await downloadImage(sock, targetMsg)

      const result = await askMistral(prompt, base64, mimeType)

      await sock.sendMessage(jid, { text: result.text })

      addMemory(participant, "user", `[Kirim gambar] ${prompt}`)
      addMemory(participant, "assistant", result.text)
      logUsage(participant, result.usage, 0)
      return
    }

    const fullPrompt = quotedText
      ? `[Pesan yang di-reply: "${quotedText}"]\n\n${prompt}`
      : prompt

    addMemory(participant, "user", prompt)

    const messages = buildContext(participant, fullPrompt)
    const result = await askGroq(messages)

    await sock.sendMessage(jid, { text: result.text })

    addMemory(participant, "assistant", result.text)
    logUsage(participant, result.usage, 0)

    await compressMemory(participant, askGroq)

  } catch (err) {
    console.error("AI error:", err)
    await sock.sendMessage(jid, {
      text: "Hm… sepertinya ada gangguan pada AI engine. Coba lagi nanti."
    })
  }
}