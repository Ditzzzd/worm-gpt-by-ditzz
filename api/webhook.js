import { Telegraf } from "telegraf";
import { BOT_TOKEN } from "../config.js";
import { setupWormGPT } from "../plugins/wormgpt.js";

const bot = new Telegraf(BOT_TOKEN);
setupWormGPT(bot);

export default async function handler(req, res) {
  try {
    await bot.handleUpdate(req.body);
    res.status(200).send("ok");
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).send("error");
  }
      }
