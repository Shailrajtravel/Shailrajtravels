import { Collection, Document, ObjectId } from 'mongodb';
import { storageManager } from '../database/StorageManager';

export abstract class BaseRepository<T extends Document> {
  protected abstract entityType: string;
  protected abstract baseCollectionName: string;
  protected abstract isPartitioned: boolean;

  /**
   * Retrieves the correct MongoDB Collection to use for this operation.
   * If partitioned, it checks routing or storage capacity.
   */
  protected async getCollectionForWrite(id: string): Promise<Collection<T>> {
    if (!this.isPartitioned) {
      return storageManager.getGlobalCollection<T>(this.baseCollectionName);
    }
    return storageManager.getCollectionForWrite<T>(this.entityType, id, this.baseCollectionName);
  }

  protected async getCollectionForRead(id: string): Promise<Collection<T>> {
    if (!this.isPartitioned) {
      return storageManager.getGlobalCollection<T>(this.baseCollectionName);
    }
    return storageManager.getCollectionForRead<T>(this.entityType, id, this.baseCollectionName);
  }

  // --- Common CRUD Operations ---

  async findById(id: string): Promise<T | null> {
    const col = await this.getCollectionForRead(id);
    return col.findOne({ _id: new ObjectId(id) } as any) as unknown as Promise<T | null>;
  }

  async insertOne(doc: any, id?: string): Promise<string> {
    const docId = id || new ObjectId().toString();
    const col = await this.getCollectionForWrite(docId);
    
    // Ensure _id is an ObjectId & initialize optimistic locking version
    const insertDoc = { ...doc };
    if (insertDoc.__v === undefined) insertDoc.__v = 1;
    if (!insertDoc._id) insertDoc._id = new ObjectId(docId);
    
    await col.insertOne(insertDoc);
    return docId;
  }

  async updateOne(id: string, updateData: any, expectedVersion?: number): Promise<void> {
    const col = await this.getCollectionForRead(id);
    const filter: any = { _id: new ObjectId(id) };
    if (expectedVersion !== undefined) {
      filter.__v = expectedVersion;
    }
    
    // Increment version counter atomically on update
    const updatePayload: any = { $set: { ...updateData }, $inc: { __v: 1 } };
    delete updatePayload.$set.__v; // Protect __v from accidental manual override

    const res = await col.updateOne(filter, updatePayload);
    if (expectedVersion !== undefined && res.matchedCount === 0) {
      throw new Error(`Concurrency Conflict: Document version mismatch (expected __v: ${expectedVersion}). Re-fetch required.`);
    }
  }

  async deleteOne(id: string): Promise<void> {
    const col = await this.getCollectionForRead(id);
    await col.deleteOne({ _id: new ObjectId(id) } as any);
  }
}
