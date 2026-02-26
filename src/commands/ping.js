module.exports = {
  name: "ping",
  permission: "public",
  cooldown: 5000,
  execute: async (sock, ctx) => {
    await sock.sendMessage(ctx.jid, {
      text: "Pong 😌"
    })
  }
}