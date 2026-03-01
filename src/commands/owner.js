module.exports = {
  name: "owner",
  description: "Informasi owner bot",
  usage: ".ai owner",
  permission: "public",
  cooldown: 5000,

  execute: async (sock, ctx) => {
    const { jid } = ctx

    await sock.sendMessage(jid, {
      text: `👑 *Owner*

Nama      : DitDev
GitHub    : https://github.com/rillToMe
TikTok    : https://tiktok.com/@goodvibes_music28
Instagram : https://instagram.com/rill_lyrics
Discord   : https://discord.com/users/880387714896244787`
    })
  }
}