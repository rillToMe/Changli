const { isAdmin, isAllowedGroup } = require("./config/access")
const { add, load } = require("./memory/memory")
const logger = require("./utils/logger")
const { commands, commandList } = require("./commands")
const { isOnCooldown } = require("./utils/cooldown")

const { runMiddlewares } = require("./middleware")
const permissionMiddleware = require("./middleware/permission")
const cooldownMiddleware = require("./middleware/cooldown")
const aiFallbackMiddleware = require("./middleware/aiFallback")

async function messageHandler(sock, { messages, type }) {
    if (type !== "notify") return

    const msg = messages[0]
    if (!msg.message) return
    if (msg.key.fromMe) return

    const rawRemoteJid = msg.key.remoteJid
    const rawParticipant = msg.key.participant || rawRemoteJid

    const text =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text

    if (!text) return
    if (!text.startsWith(process.env.PREFIX)) return

    const prompt = text.slice(process.env.PREFIX.length).trim()
    if (!prompt) return
    
    const parts = prompt.split(" ")
    const commandName = parts[0].toLowerCase()

    console.log("RAW PROMPT:", prompt)
    console.log("COMMAND NAME:", commandName)
    console.log("AVAILABLE:", Object.keys(commands))

    console.log("PREFIX:", JSON.stringify(process.env.PREFIX))
    console.log("COMMAND NAME:", JSON.stringify(commandName))
    console.log("AVAILABLE:", JSON.stringify(Object.keys(commands)))

    const args = parts.slice(1)

    const command = commands[commandName]
    const jid = msg.key.remoteJid
    const participant = msg.key.participant 
    ? msg.key.participant 
    : msg.key.remoteJid

    const ctx = {
        sock,
        jid,
        participant,
        msg,
        command,
        commandName,
        args,
        prompt,
        commandList,
        isAdmin: participant === process.env.ADMIN_LID,
        isGroup: jid.endsWith("@g.us")
    }

    await runMiddlewares(ctx, [
        permissionMiddleware,
        cooldownMiddleware,
        async (ctx, next) => {
            if (ctx.command) {
                await ctx.command.execute(ctx.sock, ctx, ctx.args)
                return
            }
            await next()
        },
        aiFallbackMiddleware
    ])

  const admin = isAdmin(rawRemoteJid, rawParticipant)

  logger.info(`Message from ${rawParticipant}: ${prompt}`)

  // PRIVATE
  if (!rawRemoteJid.endsWith("@g.us")) {
    if (!admin) return
  }

  // GROUP
  if (rawRemoteJid.endsWith("@g.us")) {
    if (!isAllowedGroup(rawRemoteJid)) {
        logger.warn("Blocked message from unathorized group")
        return
    }
  }

}

module.exports = messageHandler