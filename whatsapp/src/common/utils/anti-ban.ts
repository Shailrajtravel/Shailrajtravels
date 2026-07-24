import { IWhatsAppEngine } from '../../engine/interfaces/whatsapp-engine.interface';
import { createLogger } from '../services/logger.service';

const logger = createLogger('AntiBanSystem');

/**
 * Humanistic Anti-Ban Typing Simulation
 * 
 * 1. Random reading pause (300ms - 700ms) simulating human reading time.
 * 2. Send read receipt (sendSeen) to indicate message has been read.
 * 3. Turn on 'typing...' presence state.
 * 4. Calculate organic typing duration based on reply text length (~25ms per char, ±15% jitter).
 * 5. Pause presence state after sending.
 */
export async function simulateHumanisticTyping(
  engine: IWhatsAppEngine,
  chatId: string,
  replyText: string,
): Promise<void> {
  if (process.env.ANTI_BAN_TYPING === 'false' || process.env.SIMULATE_TYPING === 'false') {
    return;
  }

  try {
    // 1. Initial human reading delay (300ms - 700ms)
    const readJitter = 300 + Math.floor(Math.random() * 400);
    await new Promise(resolve => setTimeout(resolve, readJitter));

    // 2. Mark message as seen / read if engine supports it
    if (typeof (engine as any).sendSeen === 'function') {
      await (engine as any).sendSeen(chatId).catch(() => undefined);
    }

    // 3. Turn on typing presence
    await engine.sendChatState(chatId, 'typing').catch(() => undefined);

    // 4. Calculate realistic typing duration based on character count (~25ms/char with ±15% jitter)
    const minMs = Number(process.env.SIMULATE_TYPING_MIN_MS) || 1200;
    const maxMs = Number(process.env.SIMULATE_TYPING_MAX_MS) || 6000;
    const baseDuration = Math.min(maxMs, Math.max(minMs, 500 + replyText.length * 25));
    const jitteredDuration = Math.round(baseDuration * (0.85 + Math.random() * 0.3));

    logger.debug(`[AntiBan] Simulating human typing for ${chatId} (${jitteredDuration}ms)`);
    await new Promise(resolve => setTimeout(resolve, jitteredDuration));

    // 5. Reset presence state after typing
    await engine.sendChatState(chatId, 'paused').catch(() => undefined);
  } catch (err) {
    logger.warn(`[AntiBan] Typing simulation warning: ${err instanceof Error ? err.message : String(err)}`);
  }
}
