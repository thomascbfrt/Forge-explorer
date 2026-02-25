import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { TopicJSON } from '../model/interfaces/topic.model';
import { Topic } from '../model/classes/topic.class';
import { ApiService } from './api.service';

/**
 * Service for interacting with the Topics REST API.
 *
 * Extends the base ApiService to provide topic-specific operations such as
 * fetching a paginated list of topics, retrieving a single topic by id, and
 * searching topics. This service is provided in the root injector.
 *
 * @remarks
 * All network calls use the REST_URL base defined on the ApiService.
 */
@Injectable({
  providedIn: 'root',
})
export class TopicApiService extends ApiService {
  /**
   * Fetch all topics in gitlab.
   * @returns A observable topic's list.
   */
  getTopics(): Observable<Topic[]> {
    return this.getAllRessource(this.REST_URL + '/topics?per_page=20').pipe(
      map((response) => response.map((item) => new Topic(item))),
    );
  }

  /**
   * Fetch topic by ID.
   * @param id - topic ID
   * @returns A observable topic match ID
   */
  getTopic(id: number): Observable<Topic> {
    return this.http
      .get<TopicJSON>(this.REST_URL + '/topics/' + id)
      .pipe(map((response) => new Topic(response)));
  }

  /**
   * Fetch topics match search string.
   * @param search - search string
   * @returns A observable topic's list match search string
   */
  getTopicsMatchSearch(search: string): Observable<Topic[]> {
    return this.getAllRessource(
      this.REST_URL + '/topics?search=' + search,
    ).pipe(map((response) => response.map((item) => new Topic(item))));
  }
}
