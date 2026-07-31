import { BaseRepository } from '../repositories/BaseRepository';

export class IssueRepository extends BaseRepository<any> {
  protected entityType = "issue";
  protected baseCollectionName = "issues";
  protected isPartitioned = false;

  async find(filter: any = {}, options: any = {}): Promise<any[]> {
    // For non-partitioned collections, id doesn't matter, we can pass any string.
    const col = await this.getCollectionForRead('default');
    return col.find(filter, options).toArray();
  }
}

export const issueRepository = new IssueRepository();
