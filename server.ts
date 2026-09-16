import express from "express";
import path from "path";
import https from "https";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// In-memory cache for ultra-fast instant Romanian audio playback (< 2ms response)
const roAudioCache = new Map<string, string>();

// Clean & prepare text for children's natural Romanian speech
function cleanTextForSpeech(text: string): string {
  return text
    .replace(/[🌪️🐻‍❄️🐪🐬🐒🎴💡✨⭐🎉🎊🏠🍽️❤️✅❌👍🌿]/g, "") // remove emojis from speech
    .replace(/4–7\s*ani/gi, "patru până la șapte ani")
    .replace(/\s+/g, " ")
    .trim();
}

function getCacheKey(text: string): string {
  return cleanTextForSpeech(text).toLowerCase();
}

// Fetch single chunk of native Romanian TTS from Google's neural Romanian service
function fetchRomanianTtsChunk(text: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const url =
      "https://translate.google.com/translate_tts?ie=UTF-8&tl=ro&client=tw-ob&q=" +
      encodeURIComponent(text);

    https
      .get(
        url,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
        },
        (res) => {
          if (res.statusCode !== 200) {
            return reject(new Error(`TTS Service status code: ${res.statusCode}`));
          }
          const chunks: Buffer[] = [];
          res.on("data", (c) => chunks.push(c));
          res.on("end", () => resolve(Buffer.concat(chunks)));
        }
      )
      .on("error", reject);
  });
}

// Synthesize Romanian speech with natural diction and intonation for young children
async function synthesizeRomanianAudio(rawText: string): Promise<string> {
  const text = cleanTextForSpeech(rawText);
  if (!text) {
    throw new Error("Textul pentru sinteză este gol.");
  }

  const cacheKey = getCacheKey(text);
  if (roAudioCache.has(cacheKey)) {
    return roAudioCache.get(cacheKey)!;
  }

  // Split text into natural sentence/clause chunks under 140 chars for flawless delivery
  const sentences = text.match(/[^.!?,\n]+[.!?,\n]*|[^.!?,\n]+$/g) || [text];
  const chunks: string[] = [];
  let current = "";

  for (const s of sentences) {
    const trimmed = s.trim();
    if (!trimmed) continue;
    if ((current + " " + trimmed).trim().length <= 140) {
      current = (current + " " + trimmed).trim();
    } else {
      if (current) chunks.push(current);
      current = trimmed;
    }
  }
  if (current) chunks.push(current);

  // Fetch audio chunks sequentially to maintain exact natural reading order
  const audioBuffers: Buffer[] = [];
  for (const chunk of chunks) {
    const buf = await fetchRomanianTtsChunk(chunk);
    audioBuffers.push(buf);
  }

  const combinedMp3 = Buffer.concat(audioBuffers);
  const dataUrl = `data:audio/mp3;base64,${combinedMp3.toString("base64")}`;

  // Cache permanently in memory for instant zero-delay playback
  roAudioCache.set(cacheKey, dataUrl);
  return dataUrl;
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    language: "ro-RO",
    voice: "Romanian Natural Voice (Copii 4-7 ani)",
    cachedPhrasesCount: roAudioCache.size,
  });
});

// Dedicated Romanian TTS endpoint
app.post("/api/tts", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Parametrul 'text' este obligatoriu." });
    }

    const cacheKey = getCacheKey(text);
    const wasCached = roAudioCache.has(cacheKey);

    const audioUrl = await synthesizeRomanianAudio(text);

    return res.json({
      audioUrl,
      cached: wasCached,
      language: "ro-RO",
      voice: "Romanian Natural Voice",
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Eroare TTS";
    console.error("[Romanian TTS Error]:", errMessage);
    return res.status(500).json({
      error: errMessage,
      fallbackToSpeechSynthesis: true,
    });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT} with Natural Romanian Voice`);
  });
}

startServer();
