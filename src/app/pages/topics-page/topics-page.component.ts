import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { finalize, Subscription } from 'rxjs';
import { Router, RouterLink } from '@angular/router';

import { GraphForge, NodeType, Topic, TopicApiService } from 'ngx-forge-map';

@Component({
  selector: 'app-topics-page',
  templateUrl: './topics-page.component.html',
  styleUrl: './topics-page.component.scss',
  imports: [RouterLink],
})
export class TopicsComponent {
  @ViewChild('topicsChart', { static: true }) topicsChart!: ElementRef;
  private current_search_request?: Subscription;

  protected isLoading: boolean = false;
  protected topicGraph!: GraphForge;
  protected topics: Topic[] = [];
  protected selectedTopic: any;
  protected searchMessage: string = '';

  private readonly topicService: TopicApiService = inject(TopicApiService);
  private readonly router: Router = inject(Router);

  ngOnInit() {
    this.topicGraph = new GraphForge(this.topicsChart.nativeElement);

    this.topicGraph.onNodeSelect().subscribe((id) => this.onNodeClicked(id));
    this.topicGraph
      .onNodeDoubleClick()
      .subscribe((id) => this.onNodeDoubleClicked(id));

    this.showAllTopics();
  }

  // ========== PRIVATE METHODES ========== //

  private onNodeDoubleClicked(id: string): void {
    const topic_id: number = this.topicGraph.getNodeID(id);
    const topic: Topic | undefined = this.getTopicByID(topic_id);

    if (topic) this.redirectToProjects(topic);
  }

  private redirectToProjects(topic: Topic): void {
    this.router.navigate(['/projects'], {
      queryParams: { topics: topic.name },
    });
  }

  private onNodeClicked(id: string) {
    const true_id = this.topicGraph.getNodeID(id);
    const topic = this.getTopicByID(true_id);
    if (topic) {
      this.selectedTopic = topic;
    }
  }

  private showAllTopics(): Subscription {
    this.isLoading = true;
    return this.topicService
      .getTopics()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe((topics) => {
        this.fill(topics);
      });
  }

  private fill(topics: Topic[]) {
    topics.forEach((topic) => {
      this.topicGraph.createTopic(topic, topic.total_projects_count);
      this.topics.push(topic);
    });
    this.topics.sort(
      (a: any, b: any) => b.total_projects_count - a.total_projects_count,
    );
  }

  private getTopicByID(id: number): Topic | undefined {
    let rep: Topic | undefined = undefined;

    this.topics.forEach((topic) => {
      if (topic.id == id) {
        rep = topic;
      }
    });

    return rep;
  }

  // ========== PROTECTED METHODES ========== //

  protected onSearch(query: string): void {
    if (this.current_search_request) this.current_search_request.unsubscribe();

    if (query.length == 0) {
      this.searchMessage = '';
      this.current_search_request = this.showAllTopics();
      return;
    }

    if (query.length < 3) {
      this.searchMessage = 'Veuillez saisir au moins 3 caractères';
      this.topics = [];
      this.topicGraph.clear();
      return;
    }

    this.searchMessage = '';
    this.topics = [];
    this.isLoading = true;
    this.topicGraph.clear();
    this.current_search_request = this.topicService
      .getTopicsMatchSearch(query)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.topicGraph.fit();
        }),
      )
      .subscribe((rep) => {
        if (rep.length === 0) {
          this.searchMessage = 'Aucun résultat trouvé';
        }
        this.fill(rep);
      });
  }

  protected topicSelected(topic: Topic) {
    this.selectedTopic = topic;
    const graph_id = this.topicGraph.generateID(
      NodeType.TOPIC,
      topic.id.toString(),
    );
    this.topicGraph.selectNode(graph_id);

    this.topicGraph.focus(graph_id);
  }

  protected test2clickEvent(elt: any): void {
    this.redirectToProjects(elt);
  }

  protected exploreClick(): void {
    this.redirectToProjects(this.selectedTopic);
  }
}
