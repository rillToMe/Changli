const fs = require("fs")
const path = require("path")

const commands = {}
const commandList = []

const commandFiles = fs
  .readdirSync(__dirname)
  .filter(file => file.endsWith(".js") && file !== "index.js")

for (const file of commandFiles) {
  try {
    const command = require(path.join(__dirname, file))
    if (!command.name) continue

    commands[command.name] = command
    commandList.push(command)
  } catch (err) {
    console.error("Failed loading command:", file, err)
  }
}

module.exports = {
  commands,
  commandList
}