module.exports = async function permissionMiddleware(ctx, next) {
  if (!ctx.command) {
    return next()
  }

  const { command, isAdmin, isGroup, sock, jid } = ctx

  const permission = command.permission || "public"

  if (permission === "admin" && !isAdmin) {
    await sock.sendMessage(jid, {
      text: "❌ Admin only 😌"
    })
    return
  }

  if (permission === "group" && !isGroup) {
    await sock.sendMessage(jid, {
      text: "❌ Command hanya untuk group"
    })
    return
  }

  if (permission === "private" && isGroup) {
    await sock.sendMessage(jid, {
      text: "❌ Command hanya untuk private"
    })
    return
  }

  await next()
}