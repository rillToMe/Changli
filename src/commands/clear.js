module.exports = {
  name: "clear",
  permission: "admin",
  description: "Hapus memory percakapan AI kamu",
  usage: ".ai clear",
  
  cooldown: 10000,
  execute: async (sock, ctx) => {
    const fs = require("fs")
    const MEMORY_FILE = "./memory.json"

    const db = JSON.parse(fs.readFileSync(MEMORY_FILE))
    delete db[ctx.participant]
    fs.writeFileSync(MEMORY_FILE, JSON.stringify(db, null, 2))

    await sock.sendMessage(ctx.jid, {
      text: "Memory cleared 😌"
    })
  }
}