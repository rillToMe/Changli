function isAdmin(rawRemoteJid, rawParticipant) {
  return (
    rawRemoteJid === process.env.ADMIN_LID ||
    rawParticipant === process.env.ADMIN_LID
  )
}

function isAllowedGroup(jid) {
  return jid === process.env.ALLOWED_GROUP
}

module.exports = { isAdmin, isAllowedGroup }