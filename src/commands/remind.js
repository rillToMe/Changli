module.exports = {
  name: "remind",
  permission: "public",
  cooldown: 3000,
  description: "Set reminder, format waktu: s/m/h/d",
  usage: ".ai remind 30m beli susu",

  execute: async (sock, ctx) => {
    const { jid, participant, args } = ctx

    const timeArg = args[0]
    const message = args.slice(1).join(" ").trim()

    if (!timeArg || !message) {
      await sock.sendMessage(jid, {
        text: "❌ Format salah\nContoh:\n`.ai remind 30m beli susu`\n`.ai remind 2h meeting sama bos`\n`.ai remind 1d deadline tugas`"
      })
      return
    }

    const match = timeArg.match(/^(\d+)(s|m|h|d)$/)
    if (!match) {
      await sock.sendMessage(jid, {
        text: "❌ Format waktu salah. Gunakan: `30s`, `10m`, `2h`, `1d`"
      })
      return
    }

    const value = parseInt(match[1])
    const unit = match[2]

    const multiplier = { s: 1000, m: 60000, h: 3600000, d: 86400000 }
    const delay = value * multiplier[unit]

    const unitLabel = { s: "detik", m: "menit", h: "jam", d: "hari" }

    if (delay > 7 * 86400000) {
      await sock.sendMessage(jid, {
        text: "❌ Maksimal reminder 7 hari."
      })
      return
    }

    await sock.sendMessage(jid, {
      text: `⏰ Oke! Aku akan ingatkan kamu soal "${message}" dalam ${value} ${unitLabel[unit]}.`
    })

    setTimeout(async () => {
      try {
        await sock.sendMessage(jid, {
          text: `⏰ *Reminder!*\n\n${message}`,
          mentions: [participant]
        })
      } catch (err) {
        console.error("Reminder send error:", err.message)
      }
    }, delay)
  }
}