const { askCerebras } = require("../ai/cerebrasClient")
const { Supadata } = require("@supadata/js")

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
  permission: "public",
  cooldown: 30000,
  description: "Ringkas video YouTube dari transcript",
  usage: ".ai yt-ts https://youtu.be/xxxxx",

  execute: async (sock, ctx) => {
    const { jid, args } = ctx
    const url = args[0]

    if (!url) {
      await sock.sendMessage(jid, {
        text: "❌ Tulis URL YouTube-nya\nContoh: `.ai yt-ts https://youtu.be/xxxxx`"
      })
      return
    }

    const videoId = extractVideoId(url)
    if (!videoId) {
      await sock.sendMessage(jid, {
        text: "❌ URL tidak valid."
      })
      return
    }

    const waitMsg = await sock.sendMessage(jid, {
      text: "⏳ Mengambil transcript, tunggu sebentar..."
    })

    let transcript = ""
    try {
      const supadata = new Supadata({ apiKey: process.env.SUPADATA_API_KEY })

      const result = await supadata.youtube.transcript({
        videoId,
        text: true  
      })

      transcript = typeof result.content === "string"
        ? result.content
        : result.content?.map(s => s.text).join(" ") || ""

      transcript = transcript.replace(/\[.*?\]/g, "").trim()

    } catch (err) {
      console.error("Transcript error:", err.message)
      await sock.sendMessage(jid, {
        text: "❌ Gagal mengambil transcript. Video mungkin tidak punya subtitle."
      }, { quoted: waitMsg })
      return
    }

    if (!transcript) {
      await sock.sendMessage(jid, {
        text: "❌ Transcript kosong untuk video ini."
      }, { quoted: waitMsg })
      return
    }

    const trimmed = transcript.length > 12000
      ? transcript.slice(0, 12000) + "... [dipotong]"
      : transcript

    let result
    try {
      result = await askCerebras([
        {
          role: "system",
          content: "Kamu adalah asisten yang bertugas merangkum transcript video YouTube. Buat ringkasan yang jelas, terstruktur, dan mudah dipahami dalam bahasa Indonesia. Sertakan poin-poin utama yang dibahas. PENTING: Jangan gunakan simbol markdown seperti *, **, #, ##, ###, |, atau tanda formatting lainnya. Gunakan teks biasa saja. Boleh gunakan angka dan tanda baca normal seperti titik, koma, tanda tanya, dan tanda seru. Untuk judul bagian gunakan huruf kapital."
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

    await sock.sendMessage(jid, {
      text: `📝 *Ringkasan Video*\n\n${result.text}`
    }, { quoted: waitMsg })
  }
}