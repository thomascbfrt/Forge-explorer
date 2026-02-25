import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { GroupJSON } from '../model/interfaces/group.model';
import { UserJSON } from '../model/interfaces/user.model';
import { Project } from '../model/classes/project.class';
import { Group } from '../model/classes/group.class';
import { User } from '../model/classes/user.class';
import { ApiService } from './api.service';

/**
 * Service providing group-related API operations against the GitLab REST and GraphQL endpoints.
 *
 * Extends ApiService to reuse common REST/GraphQL URL and HTTP helpers.
 *
 * Responsibilities:
 * - Query groups by search terms.
 * - Fetch group details, projects and members.
 * - Translate GraphQL gid://gitlab URIs to numeric user IDs.
 */
@Injectable({
  providedIn: 'root',
})
export class GroupApiService extends ApiService {
  /**
   * Fetch groups matching the provided search term.
   * Gitlab API doc : https://docs.gitlab.com/api/groups/#search-for-a-group
   *
   * @param search - The search term used to match group names.
   * @returns A observable list of Group.
   */
  getGroupMatchSearch(search: string): Observable<Group[]> {
    return this.getAllRessource(
      this.REST_URL + '/groups?search=' + search + '&per_page=20',
    ).pipe(map((response) => response.map((item) => new Group(item))));
  }

  /**
   * Fetch projects that belong to a given group.
   * Gitlab API doc : https://docs.gitlab.com/api/groups/#list-projects
   *
   * @param id - Numeric ID of the group.
   * @param amount - Number of projects per page (per_page). Default is 20.
   * @param page - Page number to retrieve. Default is 1.
   * @returns A observable list of Project made by the group.
   */
  getGroupProjects(id: number): Observable<Project[]> {
    return this.getAllRessource(
      this.REST_URL + '/groups/' + id + '/projects?page=1&per_page=20',
    ).pipe(map((response) => response.map((item) => new Project(item))));
  }

  /**
   * Fetch a single group by its numeric ID.
   * Gitlab API doc : https://docs.gitlab.com/api/groups/#retrieve-a-group
   *
   * @param id - Numeric ID of the group to fetch.
   * @returns A observable group for the given ID.
   */
  getGroup(id: number): Observable<Group> {
    return this.http
      .get<GroupJSON>(this.REST_URL + '/groups/' + id)
      .pipe(map((response) => new Group(response)));
  }

  /**
   * Fetch members of a group.
   * Gitlab API doc : https://docs.gitlab.com/api/group_members/#list-all-group-members
   *
   * @param id - Numeric ID of the group.
   * @returns A observable users list for the given group ID.
   */
  getGroupMembers(id: number): Observable<User[]> {
    interface T {
      data: {
        group: {
          groupMembers: {
            nodes: [
              {
                user: UserJSON;
              },
            ];
          };
        };
      };
    }
    const body = {
      query:
        'query($name: ID!) { group(fullPath: $name) { groupMembers { nodes { user { id username name state avatarUrl webUrl } } } } }',
      variables: {
        name: id,
      },
    };

    return this.http.post<T>(this.graphql_url, body).pipe(
      map((response) => {
        return response.data.group.groupMembers.nodes.map(
          (item) => new User(item.user),
        );
      }),
    );
  }
}
