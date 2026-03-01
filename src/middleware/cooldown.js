const { isOnCooldown } = require("../utils/cooldown")

const GLOBAL_COOLDOWN = 2000

module.exports = async function cooldownMiddleware(ctx, next) {
    if (!ctx.command) {
    return next()
    }
    
    const { command, participant, commandName, sock, jid } = ctx

    // GLOBAL COOLDOWN
    const globalKey = `${participant}:global`
    const globalRemaining = isOnCooldown(globalKey, GLOBAL_COOLDOWN)

    if (globalRemaining) {
        await sock.sendMessage(jid, {
            text: `⏳ Santai dulu ${Math.ceil(globalRemaining / 1000)} detik 😌`
        })
        return
    }

    // PER COMMAND COOLDOWN
    const duration = command.cooldown || 0

    if (duration > 0) {
        const commandKey = `${participant}:${commandName}`
        const remaining = isOnCooldown(commandKey, duration)

        if (remaining) {
            await sock.sendMessage(jid, {
                text: `⏳ Command ini tunggu ${Math.ceil(remaining / 1000)} detik lagi 😌`
            })
            return
        }
    }

    await next()
}