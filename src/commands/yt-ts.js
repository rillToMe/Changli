const { askCerebras } = require("../ai/cerebrasClient")
const { getTranscript } = require("../ai/transcriptEngine")

function extractVideoId(input) {
  const patterns = [
    /(?:v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:shorts\/)([a-zA-Z0-9_-]{11})/
  ]
  for (const pattern of patterns) {
    const match = input.match(pattern)
    if (match) return match[1]
  }
  return null
}

module.exports = {
  name: "yt-ts",
  description: "Ringkas video YouTube dari transcript",
  usage: ".ai yt-rs https://youtu.be/xxxxx",
  permission: "public",
  cooldown: 30000,

  execute: async (sock, ctx) => {
    const { jid, args } = ctx
    const url = args[0]

    if (!url) {
      await sock.sendMessage(jid, {
        text: "❌ Kasih URL YouTube-nya\nContoh: `.ai yt-rs https://youtu.be/xxxxx`"
      })
      return
    }

    const videoId = extractVideoId(url)
    if (!videoId) {
      await sock.sendMessage(jid, { text: "❌ URL tidak valid." })
      return
    }

    const waitMsg = await sock.sendMessage(jid, {
      text: "⏳ Mengambil transcript, tunggu sebentar..."
    })

    let transcript
    try {
      transcript = await getTranscript(videoId)
    } catch (err) {
      console.error("Transcript error:", err.message)
      await sock.sendMessage(jid, {
        text: "❌ Gagal mengambil transcript. Coba lagi nanti."
      }, { quoted: waitMsg })
      return
    }

    if (!transcript || transcript.length < 50) {
      await sock.sendMessage(jid, {
        text: "❌ Transcript tidak tersedia untuk video ini."
      }, { quoted: waitMsg })
      return
    }

    const trimmed = transcript.length > 30000
      ? transcript.slice(0, 30000) + "... [dipotong]"
      : transcript

    let result
    try {
      result = await askCerebras([
        {
          role: "system",
          content: "Kamu adalah asisten yang bertugas merangkum transcript video YouTube. Buat ringkasan yang jelas, terstruktur, dan mudah dipahami dalam bahasa Indonesia. Sertakan poin-poin utama. Jangan gunakan simbol markdown seperti *, **, #, ###, |. Gunakan teks biasa. Untuk judul bagian gunakan huruf kapital."
        },
        {
          role: "user",
          content: `Berikut transcript video YouTube:\n\n${trimmed}\n\nTolong buat ringkasan lengkap.`
        }
      ])
    } catch (err) {
      console.error("Cerebras error:", err.message)
      await sock.sendMessage(jid, {
        text: "❌ Gagal meringkas transcript."
      }, { quoted: waitMsg })
      return
    }

    const cleanText = result.text
      .replace(/#{1,6}\s?/g, "")
      .replace(/\*{1,2}([^*]+)\*{1,2}/g, "$1")
      .replace(/\|/g, "")
      .trim()

    await sock.sendMessage(jid, {
      text: `📝 Ringkasan Video\n\n${cleanText}`
    }, { quoted: waitMsg })
  }
}