import { ProjectJSON, ProjectNamespaceJSON } from '../interfaces/project.model';

export class Project {
  public readonly id: number;
  public readonly description: string;
  public readonly name: string;
  public readonly name_with_namespace: string;
  public readonly path: string;
  public readonly path_with_namespace: string;
  public readonly created_at: string;
  public readonly default_branch: string;
  public readonly tag_list: string[];
  public readonly topics: string[];
  public readonly ssh_url_to_repo: string;
  public readonly http_url_to_repo: string;
  public readonly web_url: string;
  public readonly readme_url: string;
  public readonly forks_count: number;
  public readonly avatar_url: undefined;
  public readonly star_count: number;
  public readonly last_activity_at: string;
  public readonly namespace: ProjectNamespaceJSON;

  constructor(project: ProjectJSON) {
    this.id = project.id;
    this.description = project.description;
    this.name = project.name;
    this.name_with_namespace = project.name_with_namespace;
    this.path = project.path;
    this.path_with_namespace = project.path_with_namespace;
    this.created_at = project.created_at;
    this.default_branch = project.default_branch;
    this.tag_list = project.tag_list;
    this.topics = project.topics;
    this.ssh_url_to_repo = project.ssh_url_to_repo;
    this.http_url_to_repo = project.http_url_to_repo;
    this.web_url = project.web_url;
    this.readme_url = project.readme_url;
    this.forks_count = project.forks_count;
    this.avatar_url = project.avatar_url;
    this.star_count = project.star_count;
    this.last_activity_at = project.last_activity_at;
    this.namespace = project.namespace;
  }
}
