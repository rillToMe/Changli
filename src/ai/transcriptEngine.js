const fs = require("fs")
const path = require("path")
const { Supadata } = require("@supadata/js")
const youtubeDl = require("youtube-dl-exec")
const { AssemblyAI } = require("assemblyai")

const CACHE_DIR = path.join(process.cwd(), "data", "transcript")

if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true })
}

const rawKeys = process.env.ASSEMBLYAI_API_KEYS
  ? process.env.ASSEMBLYAI_API_KEYS.split(",")
  : [process.env.ASSEMBLYAI_API_KEY]

const keyPool = rawKeys.map(key => ({
  key: key.trim(),
  cooldownUntil: 0
}))

let pointer = 0

function getNextAvailableKey() {
  const now = Date.now()
  for (let i = 0; i < keyPool.length; i++) {
    const index = (pointer + i) % keyPool.length
    const entry = keyPool[index]
    if (entry.cooldownUntil <= now) {
      pointer = (index + 1) % keyPool.length
      return entry
    }
  }
  return null
}

function getCachePath(videoId) {
  return path.join(CACHE_DIR, `${videoId}.json`)
}

function loadCache(videoId) {
  const cachePath = getCachePath(videoId)
  if (!fs.existsSync(cachePath)) return null
  try {
    const data = JSON.parse(fs.readFileSync(cachePath, "utf-8"))
    return data.transcript || null
  } catch {
    return null
  }
}

function saveCache(videoId, transcript) {
  const cachePath = getCachePath(videoId)
  fs.writeFileSync(cachePath, JSON.stringify({
    videoId,
    cachedAt: new Date().toISOString(),
    transcript
  }, null, 2))
}

async function fetchViaSupadata(videoId) {
  const supadata = new Supadata({ apiKey: process.env.SUPADATA_API_KEY })
  const result = await supadata.youtube.transcript({ videoId, text: true })

  const text = typeof result.content === "string"
    ? result.content
    : result.content?.map(s => s.text).join(" ") || ""

  return text.replace(/\[.*?\]/g, "").trim()
}

async function fetchViaAssemblyAI(videoId, attempt = 0) {
  if (attempt >= keyPool.length) {
    throw new Error("All AssemblyAI keys exhausted.")
  }

  const entry = getNextAvailableKey()
  if (!entry) throw new Error("All AssemblyAI keys are cooling down.")

  const assemblyClient = new AssemblyAI({ apiKey: entry.key })
  const finalMp3 = path.join(CACHE_DIR, `${videoId}_audio.mp3`)

  try {
    if (attempt === 0) {
      console.log(`[ASSEMBLY] Downloading audio via yt-dlp...`)
      await youtubeDl(`https://www.youtube.com/watch?v=${videoId}`, {
        extractAudio: true,
        audioFormat: "mp3",
        audioQuality: 5,
        noPlaylist: true,
        output: path.join(CACHE_DIR, `${videoId}_audio.%(ext)s`)
      })

      if (!fs.existsSync(finalMp3)) {
        throw new Error("Audio file tidak ditemukan setelah download")
      }

      const stats = fs.statSync(finalMp3)
      const fileSizeMB = stats.size / (1024 * 1024)
      console.log(`[ASSEMBLY] Audio downloaded: ${fileSizeMB.toFixed(1)}MB`)
    }

    console.log(`[ASSEMBLY] Uploading to AssemblyAI (key ${attempt + 1})...`)
    const uploadUrl = await assemblyClient.files.upload(finalMp3)

    console.log(`[ASSEMBLY] Transcribing...`)
    const transcript = await assemblyClient.transcripts.transcribe({
      audio_url: uploadUrl,
      language_detection: true,
      speech_models: ["universal-2"]
    })

    if (transcript.status === "error") {
      throw new Error(`AssemblyAI error: ${transcript.error}`)
    }

    console.log(`[ASSEMBLY] Transcription done (${transcript.text?.length} chars)`)
    return transcript.text || ""

  } catch (err) {
    const status = err.status || err.response?.status
    if (status === 429 || status === 401 || status === 402 || status === 503) {
      console.warn(`[ASSEMBLY] Key ${attempt + 1} rate-limited. Cooling down 60s.`)
      entry.cooldownUntil = Date.now() + 60000
      return fetchViaAssemblyAI(videoId, attempt + 1)
    }
    throw err
  } finally {
    if (attempt === 0 && fs.existsSync(finalMp3)) fs.unlinkSync(finalMp3)
  }
}

async function getTranscript(videoId) {

  const cached = loadCache(videoId)
  if (cached) {
    console.log(`[ROUTER] Cache hit: ${videoId}`)
    return cached
  }

  try {
    console.log(`[ROUTER] Trying subtitle via Supadata...`)
    const transcript = await fetchViaSupadata(videoId)

    if (transcript && transcript.length > 100) {
      console.log(`[ROUTER] Subtitle detected: YES`)
      console.log(`[ROUTER] Subtitle quality: OK (${transcript.length} chars)`)
      saveCache(videoId, transcript)
      return transcript
    } else {
      console.log(`[ROUTER] Subtitle detected: YES`)
      console.log(`[ROUTER] Subtitle quality: FAIL (terlalu pendek atau kosong)`)
    }
  } catch (err) {
    console.log(`[ROUTER] Subtitle detected: NO`)
    console.log(`[ROUTER] Subtitle error: ${err.message}`)
  }

  console.log(`[ROUTER] Fallback to AssemblyAI`)
  try {
    const transcript = await fetchViaAssemblyAI(videoId)
    if (transcript) {
      console.log(`[ROUTER] AssemblyAI success (${transcript.length} chars)`)
      saveCache(videoId, transcript)
    } else {
      console.log(`[ROUTER] AssemblyAI returned empty`)
    }
    return transcript
  } catch (err) {
    console.error(`[ROUTER] AssemblyAI failed: ${err.message}`)
    throw err
  }
}

module.exports = { getTranscript }