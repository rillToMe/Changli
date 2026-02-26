const { load } = require("../memory/memory")

module.exports = {
  name: "memory",
  permission: "admin",
  cooldown: 5000,
  execute: async (sock, ctx) => {
    const data = load()[ctx.participant] || []

    await sock.sendMessage(ctx.jid, {
      text: JSON.stringify(data, null, 2)
    })
  }
}