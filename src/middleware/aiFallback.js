const { buildContext } = require("../ai/contextBuilder")
const { addMemory, compressMemory } = require("../ai/memory")
const { askGroq } = require("../ai/groqClient")
const { logUsage } = require("../ai/usage")

module.exports = async function aiFallbackMiddleware(ctx) {
  const { sock, jid, participant, prompt } = ctx

  try {
    addMemory(participant, "user", prompt)

    const messages = buildContext(participant, prompt)

   const result = await askGroq(messages)

   await sock.sendMessage(jid, { 
    text: result.text
   })

   addMemory(participant, "assistant", result.text)

   logUsage(participant, result.usage, 0)

    await compressMemory(participant, askGroq)

  } catch (err) {
    console.error("Groq error:", err)

    await sock.sendMessage(jid, {
      text: "Hm… sepertinya ada gangguan pada AI engine. Coba lagi nanti."
    })
  }
}