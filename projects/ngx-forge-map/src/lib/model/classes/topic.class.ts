import { TopicJSON } from '../interfaces/topic.model';

export class Topic {
  public readonly id: number;
  public readonly name: string;
  public readonly title: string;
  public readonly description: string | null;
  public readonly total_projects_count: number;
  public readonly organization_id: number;
  public readonly avatar_url: string | null;

  constructor(topic: TopicJSON) {
    this.id = topic.id;
    this.name = topic.name;
    this.title = topic.title;
    this.description = topic.description;
    this.total_projects_count = topic.total_projects_count;
    this.organization_id = topic.organization_id;
    this.avatar_url = topic.avatar_url;
  }
}
