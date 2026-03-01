const { permission } = require("./memory")

module.exports = {
  name: "help",
  permission: "public",
  cooldown: 3000,
  description: "Mengingat semua commands",
  usage: ".ai help",
  execute: async (sock, ctx) => {
    const prefix = process.env.PREFIX

    const list = ctx.commandList.map(cmd => {
      const usage = cmd.usage ? `\n   Contoh: ${cmd.usage}` : ""
      const desc = cmd.description ? `\n   ${cmd.description}` : ""
      return `${prefix} ${cmd.name}${desc}${usage}`
    }).join("\n\n")

    await sock.sendMessage(ctx.jid, {
      text: `📖 Available Commands:\n\n${list}`
    })
  }
}