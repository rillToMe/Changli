require("dotenv").config()

module.exports = {
  AI_PROVIDER: process.env.AI_PROVIDER,
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  ALLOWED_GROUP: process.env.ALLOWED_GROUP,
  PREFIX: process.env.PREFIX
}