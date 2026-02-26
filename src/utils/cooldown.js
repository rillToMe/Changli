const cooldowns = new Map()

function isOnCooldown(key, duration) {
  const now = Date.now()

  if (!cooldowns.has(key)) {
    cooldowns.set(key, now)
    return 0
  }

  const expiration = cooldowns.get(key) + duration

  if (now < expiration) {
    return expiration - now
  }

  cooldowns.set(key, now)
  return 0
}

module.exports = { isOnCooldown }