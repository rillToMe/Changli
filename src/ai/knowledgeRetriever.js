const fs = require("fs")
const path = require("path")

const knowledgePath = path.join(__dirname, "knowledge.json")

let knowledge = {}

if (fs.existsSync(knowledgePath)) {
  knowledge = JSON.parse(fs.readFileSync(knowledgePath))
}

function searchInternal(prompt) {
  const lower = prompt.toLowerCase()

  for (const key in knowledge) {
    const normalized = key.replaceAll("_", " ")
    if (lower.includes(normalized)) {
      return knowledge[key]
    }
  }

  return null
}

module.exports = { searchInternal }