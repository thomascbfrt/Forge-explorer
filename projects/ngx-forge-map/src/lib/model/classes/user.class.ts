import { UserJSON } from '../interfaces/user.model';

export class User {
  public readonly id: number;
  public readonly username: string;
  public readonly name: string;
  public readonly state: string;
  public readonly locked: boolean;
  public readonly avatar_url: string | null;
  public readonly web_url: string;

  constructor(user: UserJSON) {
    this.id = user.id;
    this.username = user.username;
    this.name = user.name;
    this.state = user.state;
    this.locked = user.locked;
    this.avatar_url = user.avatar_url;
    this.web_url = user.web_url;
  }
}
