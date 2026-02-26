const { buildContext } = require("../ai/contextBuilder")
const { addMemory, compressMemory } = require("../ai/memory")
const { askGroq } = require("../ai/groqClient")


module.exports = async function aiFallbackMiddleware(ctx) {
  const { sock, jid, participant, prompt } = ctx

  try {
    const messages = buildContext(participant, prompt)

    const reply = await askGroq(messages)

    await sock.sendMessage(jid, {
      text: reply
    })

    addMemory(participant, "user", prompt)
    addMemory(participant, "assistant", reply)

    await compressMemory(participant, askGroq)

  } catch (err) {
    console.error("Groq error:", err)

    await sock.sendMessage(jid, {
      text: "Hm… sepertinya ada gangguan pada AI engine. Coba lagi nanti."
    })
  }
}