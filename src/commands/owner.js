module.exports = {
  name: "owner",
  description: "Informasi owner bot",
  usage: ".ai owner",
  permission: "public",
  cooldown: 5000,

  execute: async (sock, ctx) => {
    const { jid } = ctx

    const caption = `
╭───  『 *OWNER PROFILE* 』  ───
│
│  👤 *Nama* : DitDev
│  🌐 *GitHub* : github.com/rillToMe
│  🎵 *TikTok* : @goodvibes_music28
│  📸 *Instagram* : @rill_lyrics
│  💬 *Discord* : rill_lyrics (ID: 880387714896244787)
│
╰───────────────────────────

*Note:* Silakan hubungi owner jika ada kendala atau ingin melakukan kerjasama.`

    const axios = require("axios")

    async function getBuffer(url) {
      const res = await axios.get(url, {
        responseType: "arraybuffer"
      })
      return Buffer.from(res.data)
    }

    const thumbnail = await getBuffer("https://github.com/rillToMe.png")

    await sock.sendMessage(jid, {
      text: caption.trim(),
      contextInfo: {
        externalAdReply: {
          title: "Contact My Developer",
          body: "DitDev Official Bot Support",
          thumbnail: thumbnail, 
          sourceUrl: "https://github.com/rillToMe",
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    })
  }
}