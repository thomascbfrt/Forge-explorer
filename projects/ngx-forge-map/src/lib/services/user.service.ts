import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { Project } from '../model/classes/project.class';
import { ApiService } from './api.service';

/**
 * Service providing user-related API operations.
 *
 * Extends the base ApiService to use the application's REST_URL and HttpClient.
 * This service is provided in the root injector and exposes methods to retrieve
 * user projects and user status from the backend.
 *
 * @remarks
 * - All methods return RxJS Observables that emit the parsed response from the server.
 * - HTTP errors are propagated through the returned Observables and should be handled by subscribers.
 */
@Injectable({
  providedIn: 'root',
})
export class UserApiService extends ApiService {
  /**
   * Fetch user's contributed projects.
   * @param username - gitlab user's fullname
   * @returns A observable project's list
   */
  getUserProjects(username: string): Observable<Project[]> {
    return this.getAllRessource(
      this.REST_URL +
        '/users/' +
        username +
        '/contributed_projects?per_page=100',
    ).pipe(map((response) => response.map((item) => new Project(item))));
  }
}
