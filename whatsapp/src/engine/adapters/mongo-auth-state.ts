import { Collection } from 'mongodb';
import { createLogger } from '../../common/services/logger.service';
import type { AuthenticationCreds, SignalKeyStore } from '@whiskeysockets/baileys';

export interface BaileysCredsDocument {
  _id: string; // sessionId
  creds: any;
  updatedAt: Date;
}

export interface BaileysKeyDocument {
  _id: string; // `${sessionId}_${category}_${keyId}`
  sessionId: string;
  category: string;
  keyId: string;
  value: any;
  updatedAt: Date;
}

const logger = createLogger('MongoAuthState');

export interface MongoAuthStateResult {
  state: {
    creds: AuthenticationCreds;
    keys: SignalKeyStore;
  };
  saveCreds: () => Promise<void>;
  flushPendingCreds: () => Promise<void>;
}

export async function useMongoDBAuthState(
  credsColl: Collection<BaileysCredsDocument>,
  keysColl: Collection<BaileysKeyDocument>,
  sessionId: string,
  loadLib: () => Promise<typeof import('@whiskeysockets/baileys')>,
): Promise<MongoAuthStateResult> {
  const b = await loadLib();

  // Helper to transform any object (creds or key value) into a safe, revivable JSON structure using Baileys BufferJSON
  const writeTransform = (data: any) => {
    if (!data) return data;
    return JSON.parse(JSON.stringify(data, b.BufferJSON.replacer));
  };

  const readTransform = (data: any) => {
    if (!data) return data;
    return JSON.parse(JSON.stringify(data), b.BufferJSON.reviver);
  };

  // 1. Fetch or initialize creds
  const credsDoc = await credsColl.findOne({ _id: sessionId });
  const creds: AuthenticationCreds = credsDoc?.creds
    ? readTransform(credsDoc.creds)
    : b.initAuthCreds();

  let debounceTimer: NodeJS.Timeout | null = null;
  let latestCredsToSave: AuthenticationCreds | null = null;

  const flushPendingCreds = async (): Promise<void> => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
    if (latestCredsToSave) {
      const payloadToSave = writeTransform(latestCredsToSave);
      latestCredsToSave = null;
      try {
        await credsColl.updateOne(
          { _id: sessionId },
          {
            $set: {
              creds: payloadToSave,
              updatedAt: new Date(),
            },
          },
          { upsert: true },
        );
        logger.debug(`[MongoAuth] Saved credentials for session ${sessionId}`);
      } catch (err) {
        logger.error('Failed to flush credentials to MongoDB', err instanceof Error ? err.stack : String(err));
      }
    }
  };

  const saveCreds = async (): Promise<void> => {
    latestCredsToSave = creds;
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(() => {
      void flushPendingCreds();
    }, 100);
  };

  // 2. Key Store implementation
  const keys: SignalKeyStore = {
    get: async (type, ids) => {
      const data: Record<string, any> = {};
      const prefixedIds = ids.map(id => `${sessionId}_${type}_${id}`);

      try {
        const docs = await keysColl.find({ _id: { $in: prefixedIds } }).toArray();
        for (const doc of docs) {
          let value = readTransform(doc.value);
          if (type === 'app-state-sync-key' && value) {
            value = b.proto.Message.AppStateSyncKeyData.fromObject(value);
          }
          if (value) {
            data[doc.keyId] = value;
          }
        }
      } catch (err) {
        logger.warn(`Failed to get keys for category ${type}`, {
          error: err instanceof Error ? err.message : String(err),
        });
      }
      return data;
    },
    set: async (data: any) => {
      const writeOps: any[] = [];
      const deleteIds: string[] = [];
      const dict = data as Record<string, Record<string, any>>;

      for (const category in dict) {
        if (!dict[category]) continue;
        for (const id in dict[category]) {
          const value = dict[category][id];
          const _id = `${sessionId}_${category}_${id}`;
          if (value) {
            const cleanValue = writeTransform(value);
            writeOps.push({
              updateOne: {
                filter: { _id },
                update: {
                  $set: {
                    sessionId,
                    category,
                    keyId: id,
                    value: cleanValue,
                    updatedAt: new Date(),
                  },
                },
                upsert: true,
              },
            });
          } else {
            deleteIds.push(_id);
          }
        }
      }

      try {
        if (writeOps.length > 0) {
          await keysColl.bulkWrite(writeOps, { ordered: false });
        }
        if (deleteIds.length > 0) {
          await keysColl.deleteMany({ _id: { $in: deleteIds } });
        }
      } catch (err) {
        logger.warn('Failed to write keys to MongoDB', { error: err instanceof Error ? err.message : String(err) });
      }
    },
  };

  return {
    state: { creds, keys },
    saveCreds,
    flushPendingCreds,
  };
}
