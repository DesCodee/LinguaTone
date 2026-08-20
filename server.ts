import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Initialize Google GenAI client (server-side only)
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// 1. AI Custom Phrase Analyzer (Pinyin, Romaji, Tones, Pitch Contours)
app.post("/api/ai/analyze-custom-phrase", async (req, res) => {
  try {
    const { text, lang = "zh" } = req.body;
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return res.status(400).json({ error: "Text is required" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback heuristics when API key is not yet set
      const cleanText = text.trim();
      return res.json({
        text: cleanText,
        pinyin: lang === "zh" ? "nǐ hǎo (API key pending)" : undefined,
        romaji: lang === "ja" ? "konnichiwa (API key pending)" : undefined,
        hangul: lang === "ko" ? "annyeonghaseyo (API key pending)" : undefined,
        translation: `Custom Phrase: "${cleanText}"`,
        translationRu: `Пользовательская фраза: "${cleanText}"`,
        syllables: [
          { text: cleanText, roman: cleanText, tone: 1, pitchTip: "Pronounce with steady melodic pitch" }
        ],
        toneExplanation: "AI is ready! Connect your Gemini API Key in Settings to get full syllable-by-syllable pitch breakdown.",
        culturalNote: "Listen to the native reference audio and match the melody.",
      });
    }

    const prompt = `Analyze this Asian language phrase for pitch/tone language learners:
Language code: "${lang}" (zh = Mandarin Chinese, ja = Japanese, ko = Korean)
Phrase: "${text.trim()}"

Provide a comprehensive phonetic breakdown with syllable tones, pitch heights, accurate romanization (Pinyin with tone marks for Chinese, Romaji for Japanese, Revised Romanization for Korean), accurate English and Russian translations, and specific vocal coaching advice.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a master phonetician and CJK (Chinese, Japanese, Korean) tone/pitch accent coach. Output strictly valid JSON conforming to the schema.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING, description: "Original text sanitized" },
            romanization: { type: Type.STRING, description: "Pinyin with diacritics / Romaji / Hangul romanization" },
            translation: { type: Type.STRING, description: "Natural English translation" },
            translationRu: { type: Type.STRING, description: "Natural Russian translation" },
            syllables: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING, description: "Character or syllable" },
                  roman: { type: Type.STRING, description: "Romanized form" },
                  tone: { type: Type.INTEGER, description: "Tone number 1-5 (Mandarin) or pitch level 1-3 (JA/KO)" },
                  pitchTip: { type: Type.STRING, description: "Micro-tip for pitch placement" },
                },
                required: ["text", "roman", "tone", "pitchTip"],
              },
            },
            toneExplanation: { type: Type.STRING, description: "Explanation of tone rules or pitch accent pattern (e.g. Tone 3 Sandhi, Heiban, Odaka)" },
            culturalNote: { type: Type.STRING, description: "Usage context and nuance" },
          },
          required: ["text", "romanization", "translation", "translationRu", "syllables", "toneExplanation"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({
      text: parsed.text || text,
      pinyin: lang === "zh" ? parsed.romanization : undefined,
      romaji: lang === "ja" ? parsed.romanization : undefined,
      hangul: lang === "ko" ? parsed.romanization : undefined,
      translation: parsed.translation,
      translationRu: parsed.translationRu,
      syllables: parsed.syllables || [],
      toneExplanation: parsed.toneExplanation,
      culturalNote: parsed.culturalNote,
    });
  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze phrase" });
  }
});

// 2. AI Scenario & Dialog Generator
app.post("/api/ai/generate-scenario", async (req, res) => {
  try {
    const { topic, lang = "zh", level = "beginner" } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        topic: topic || "Daily Life",
        phrases: [
          {
            text: lang === "zh" ? "老板，来一份炒饭！" : lang === "ja" ? "すみません、お会計をお願いします。" : "이거 얼마예요?",
            pinyin: lang === "zh" ? "Lǎobǎn, lái yí fèn chǎofàn!" : undefined,
            romaji: lang === "ja" ? "Sumimasen, okaikei o onegaishimasu." : undefined,
            hangul: lang === "ko" ? "Igeo eolmayeyo?" : undefined,
            translation: "Excuse me, check please / How much is this?",
            translationRu: "Подскажите, сколько это стоит?",
            tones: lang === "zh" ? [3, 3, 2, 4, 3, 4] : [1, 2, 2, 1],
            toneHint: "Focus on crisp vocal release",
          }
        ]
      });
    }

    const prompt = `Generate a realistic 3-4 sentence practice dialogue for learning ${lang === "zh" ? "Mandarin Chinese tones" : lang === "ja" ? "Japanese pitch accents" : "Korean intonation"}.
Topic: "${topic || "Cafe order / travel / anime quote"}"
Difficulty level: "${level}".
Each phrase must be fun, practical, and highly suitable for audio tone training.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert language curriculum creator. Return strictly valid JSON array of practice phrases.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            phrases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING, description: "Native script" },
                  romanization: { type: Type.STRING, description: "Pinyin with tone marks or Romaji" },
                  translation: { type: Type.STRING, description: "English meaning" },
                  translationRu: { type: Type.STRING, description: "Russian meaning" },
                  toneHint: { type: Type.STRING, description: "Pitch contour or tone rule advice" },
                },
                required: ["text", "romanization", "translation", "translationRu", "toneHint"],
              },
            },
          },
          required: ["topic", "phrases"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    const formattedPhrases = (parsed.phrases || []).map((p: any) => ({
      text: p.text,
      pinyin: lang === "zh" ? p.romanization : undefined,
      romaji: lang === "ja" ? p.romanization : undefined,
      hangul: lang === "ko" ? p.romanization : undefined,
      translation: p.translation,
      translationRu: p.translationRu,
      toneHint: p.toneHint,
    }));

    return res.json({
      topic: parsed.topic || topic,
      phrases: formattedPhrases,
    });
  } catch (error: any) {
    console.error("AI Scenario Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate scenario" });
  }
});

// 3. Checkout / Pro Subscription Simulation & Webhook endpoint
app.post("/api/checkout/create-session", (req, res) => {
  const { plan = "pro_monthly", email } = req.body;
  // Support simulated instant upgrade or LemonSqueezy / Stripe redirect
  const mockCheckoutUrl = `https://checkout.linguatone.app/pay?plan=${plan}&email=${encodeURIComponent(email || "")}`;
  res.json({
    url: mockCheckoutUrl,
    plan,
    status: "ready",
  });
});

// Setup Vite middleware for dev or static server for production
async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);

    // Serve index.html transformed by Vite for all non-API GET requests
    app.use(async (req, res, next) => {
      if (req.method !== "GET" || req.originalUrl.startsWith("/api/")) {
        return next();
      }
      try {
        const indexPath = path.resolve(process.cwd(), "index.html");
        let template = fs.readFileSync(indexPath, "utf-8");
        template = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e: any) {
        if (vite) {
          vite.ssrFixStacktrace(e);
        }
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.use((req, res, next) => {
      if (req.method !== "GET" || req.originalUrl.startsWith("/api/")) {
        return next();
      }
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[LinguaTone Server] running on http://0.0.0.0:${PORT}`);
  });
}

setupViteOrStatic().catch((err) => {
  console.error("Failed to start server:", err);
});
