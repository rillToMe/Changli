const { permission } = require("./memory")

module.exports = {
  name: "help",
  permission: "public",
  cooldown: 3000,
  execute: async (sock, ctx, args) => {
    const prefix = process.env.PREFIX

    const list = ctx.commandList
      .map(cmd => `${prefix} ${cmd.name}`)
      .join("\n")

    await sock.sendMessage(ctx.jid, {
      text: `📖 Available Commands:\n\n${list}`
    })
  }
}