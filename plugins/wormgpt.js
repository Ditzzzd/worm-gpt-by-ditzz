import axios from "axios";
import { WORMGPT_URL, HEADERS, DEFAULT_MAX_TOKENS, AUTO_REPLY_ENABLED } from "../config.js";

export async function askWormGPT(prompt) {
  const payload = {
    messages: [{ role: "user", content: prompt }],
    max_tokens: DEFAULT_MAX_TOKENS,
  };

  const { data } = await axios.post(WORMGPT_URL, payload, {
    headers: HEADERS,
    timeout: 60000,
  });

  return data?.choices?.[0]?.message?.content || "Tidak ada respon dari WormGPT.";
}

export function setupWormGPT(bot) {
  // Command: /wormgpt <prompt>
  bot.command("wormgpt", async (ctx) => {
    const prompt = ctx.message.text.replace(/^\/wormgpt\s*/, "").trim();

    if (!prompt) {
      return ctx.reply("*Gunakan format:*\n/wormgpt <pertanyaan>");
    }

    await ctx.reply("*Sedang memproses...*");

    try {
      const response = await askWormGPT(prompt);
      await ctx.reply(`*WormGPT menjawab:*\n\n${response}`);
    } catch (err) {
      await ctx.reply(`*Terjadi kesalahan:*\n${err.message}`);
    }
  });

  // Auto-reply mode
  if (AUTO_REPLY_ENABLED) {
    bot.on("message", async (ctx) => {
      const msg = ctx.message;
      if (
        msg.text &&
        msg.reply_to_message &&
        !msg.from.is_bot &&
        !msg.text.startsWith("/")
      ) {
        await ctx.reply("Memproses...");
        try {
          const response = await askWormGPT(msg.text);
          await ctx.reply(`*WormGPT menjawab:*\n\n${response}`);
        } catch (err) {
          await ctx.reply(`*Terjadi kesalahan:*\n${err.message}`);
        }
      }
    });
  }
    }
