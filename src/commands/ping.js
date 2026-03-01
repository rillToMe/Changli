module.exports = {
  name: "ping",
  permission: "public",
  cooldown: 5000,
  description: "Cek status dan latency bot",
  usage: ".ai ping",

  execute: async (sock, ctx) => {
    const start = Date.now()

    const sentMsg = await sock.sendMessage(ctx.jid, {
      text: "🏓 Pong..."
    })

    const latency = Date.now() - start
    const uptime = formatUpdate(process.uptime())
    const ram = (process.memoryUsage().rss / 1024 / 1024).toFixed(1)

    const status =
    latency < 400 ? "🟢 Excellent":
    latency <1000 ? "🟢 Normal":
    "🔴 Slow"

    await sock.sendMessage(ctx.jid, {
      text:
     `🏓 Pong

    ⚡ Latency : ${latency} ms
    📶 Status  : ${status}
    ⏳ Uptime  : ${uptime}
    💾 RAM     : ${ram} MB`
    }, { quoted: sentMsg })
  }
}

function formatUpdate(seconds) {
  const h = Math.floor(seconds /3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds% 60)
  return `${h}h ${m}m ${s}s`
}