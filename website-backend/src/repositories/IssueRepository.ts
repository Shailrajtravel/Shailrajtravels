import { BaseRepository } from '../repositories/BaseRepository';

export class IssueRepository extends BaseRepository<any> {
  protected entityType = "issue";
  protected baseCollectionName = "issues";
  protected isPartitioned = false;
}

export const issueRepository = new IssueRepository();
