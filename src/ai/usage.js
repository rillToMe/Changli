const fs = require("fs")
const path = require("path")

const file = path.join(__dirname, "../../data/usage.json")

function logUsage(user, usage, apiKeyIndex) {
  const today = new Date().toISOString().slice(0, 10)

  let data = {}
  if (fs.existsSync(file)) {
    data = JSON.parse(fs.readFileSync(file, "utf8"))
  }

  if (!data[today]) data[today] = {}

  if (!data[today][user]) {
    data[today][user] = {
      total: 0,
      prompt: 0,
      completion: 0
    }
  }

  data[today][user].total += usage.total_tokens || 0
  data[today][user].prompt += usage.prompt_tokens || 0
  data[today][user].completion += usage.completion_tokens || 0

  fs.writeFileSync(file, JSON.stringify(data, null, 2))
}

module.exports = { logUsage }