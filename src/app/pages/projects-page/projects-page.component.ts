import { finalize, Subscription, timeout } from 'rxjs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';

import {
  GraphForge,
  GroupApiService,
  NodeType,
  ProjectApiService,
  UserApiService,
} from 'ngx-forge-map';

import { ProjectHelperComponent } from './project-helper/project-helper.component';
import { FloatingToolbar } from './floating-toolbar/floating-toolbar.component';
import { InformationsComponent } from './informations/informations.component';
import { ToasterService } from '../../services/toaster/toaster.service';
import { ToolBarItem as ToolbarItem } from '../../models/toolbar-item';
import { UrlManager } from '../../services/url-manager/url-manager';

enum DataType {
  PROJECT = 'project',
  GROUP = 'group',
  USER = 'user',
}

/**
 * ProjectsComponent renders the projects graph view with interaction controls.
 *
 * @remarks
 * Leverages `GraphForge` to visualize projects, users, and groups, and coordinates toolbar actions,
 * information panels, and URL encoding/decoding for sharing selections.
 *
 * @selector app-projects-page
 * @template ./projects-page.component.html
 * @style ./projects-page.component.scss
 */
@Component({
  selector: 'app-projects-page',
  imports: [FloatingToolbar, ProjectHelperComponent, InformationsComponent, RouterLink],
  templateUrl: './projects-page.component.html',
  styleUrl: './projects-page.component.scss',
})
export class ProjectsComponent implements OnInit {
  @ViewChild('projectsChart', { static: true })
  protected projects_chart!: ElementRef;

  @ViewChild('projectHelper')
  protected project_helper!: ProjectHelperComponent;

  protected restriction_topics: string | undefined;
  protected projects_graph!: GraphForge;
  protected isLoading: boolean = false;
  protected selected_user_projects: any[] = [];
  protected selected_group_members: any[] = [];
  protected searchMessageError: string = 'Recherchez un projet !';
  protected selected_elements: any;
  protected elements: {
    projects: any[];
    users: any[];
    groups: any[];
  } = { projects: [], users: [], groups: [] };

  private current_search_request: Subscription | undefined;

  /**
   * Creates the projects component with required API services and routing helpers.
   */
  private readonly projectAPI: ProjectApiService = inject(ProjectApiService);
  private readonly toasterService: ToasterService = inject(ToasterService);
  private readonly groupAPI: GroupApiService = inject(GroupApiService);
  private readonly userAPI: UserApiService = inject(UserApiService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly urlManager: UrlManager = inject(UrlManager);

  /**
   * Bootstraps the graph instance, wires event listeners, and restores state from navigation or query params.
   */
  ngOnInit(): void {
    this.projects_graph = new GraphForge(this.projects_chart.nativeElement);

    this.projects_graph
      .onNodeDoubleClick()
      .subscribe((id) => this.onDoubleClick(id));
    this.projects_graph
      .onNodeSelect()
      .subscribe((id) => this.onSimpleClick(id));

    if (history.state.data) {
      return this.load_state();
    }

    const snapshotParams = this.route.snapshot.queryParamMap;
    if (snapshotParams.has('topics')) {
      this.restriction_topics = snapshotParams.get('topics')!;
      this.searchMessageError = '';
      this.showAllProjectMatchTopic();
    }
  }

  /**
   * Recreates the graph state from navigation history.
   */
  private load_state(): void {
    let ids_projects: number[] = history.state.data.projects || [];
    let ids_users: number[] = history.state.data.users || [];
    let ids_groups: number[] = history.state.data.groups || [];

    ids_projects.forEach((id) => {
      this.projectAPI
        .getProject(id as unknown as number)
        .subscribe((project) => {
          const id_1 = this.createProject(project);

          this.projectAPI
            .getProjectUsers(id as unknown as number)
            .subscribe((users) => {
              users.forEach((user) => {
                if (ids_users.indexOf(user.id) != -1) {
                  const id_2 = this.createUser(user);
                  this.connectNodes(id_1, id_2);
                }
              });
            });
          this.projectAPI
            .getProjectGroups(id as unknown as number)
            .subscribe((groups) => {
              groups.forEach((group) => {
                if (ids_groups.indexOf(group.id) != -1) {
                  const id_2 = this.createGroup(group);
                  this.projects_graph.connectNodes(id_1, id_2);
                }
              });
            });
        });
    });
  }

  /**
   * Connects two graph nodes by their IDs.
   *
   * @param id_1 Source node ID.
   * @param id_2 Target node ID.
   */
  private connectNodes(id_1: string, id_2: string) {
    this.projects_graph.connectNodes(id_1, id_2);
  }

  /**
   * Creates a group node and caches it locally if not already present.
   *
   * @param group Group data used to populate the node.
   */
  private createGroup(group: any) {
    const obj = { ...group, type: DataType.GROUP };
    if (!this._elementsAlreadyCreate(obj)) this.elements.groups.push(obj);
    return this.projects_graph.createGroup(obj);
  }

  /**
   * Creates a user node and caches it locally if not already present.
   *
   * @param user User data used to populate the node.
   */
  private createUser(user: any) {
    const obj = { ...user, type: DataType.USER };
    if (!this._elementsAlreadyCreate(obj)) this.elements.users.push(obj);
    return this.projects_graph.createUser(obj);
  }

  /**
   * Creates a project node and caches it locally if not already present.
   *
   * @param project Project data used to populate the node.
   */
  private createProject(project: any) {
    const obj = { ...project, type: DataType.PROJECT };
    if (!this._elementsAlreadyCreate(obj)) this.elements.projects.push(obj);
    return this.projects_graph.createProject(obj);
  }

  // ========== TOOLBAR-ACTION HANDLE ========== //

  /**
   * Routes toolbar actions to their dedicated handlers.
   *
   * @param event Toolbar action identifier.
   */
  protected onToolbarItemClicked(event: ToolbarItem): void {
    switch (event) {
      case ToolbarItem.EXPEND:
        return this.onExpendToolClicked();
      case ToolbarItem.HIDE:
        return this.onHideToolClicked();
      case ToolbarItem.COPY:
        return this.onCopyToolClicked();
      case ToolbarItem.DOC:
        this.project_helper.toogle();
        return;
    }
  }

  /**
   * Expands the selected nodes by loading their related entities.
   */
  private onExpendToolClicked(): void {
    const selected_nodes = this.projects_graph.getSelectedNodes();

    if (selected_nodes.length == 0) {
      console.warn('impossible sans selectionnée un ou plusieurs noeuds !');
      return this.toasterService.showWarn(
        'Impossible sans selectionnée un ou plusieurs noeuds !',
      );
    }

    selected_nodes.forEach((node_id) => {
      this.onDoubleClick(node_id);
    });
  }

  /**
   * Copies the encoded graph selection into the clipboard and displays a lightweight toast.
   */
  private onCopyToolClicked(): void {
    const ids_projects = this.projects_graph.getNodesIDByType(NodeType.PROJECT);
    const ids_users = this.projects_graph.getNodesIDByType(NodeType.USER);
    const ids_groups = this.projects_graph.getNodesIDByType(NodeType.GROUP);

    const url = this.urlManager.getEncodedUrl([
      { key: 'projects', value: ids_projects },
      { key: 'users', value: ids_users },
      { key: 'groups', value: ids_groups },
    ]);

    navigator.clipboard
      .writeText(url)
      .then(() => {
        this.toasterService.showSuccess('URL copiée dans le presse-papier');
        console.log('URL copiée dans le presse-papier :', url);
      })
      .catch((err) => {
        this.toasterService.showError('Erreur lors de la copie.');
        console.error('Erreur lors de la copie :', err);
      });
  }

  /**
   * Removes currently selected nodes from the graph and local cache.
   */
  private onHideToolClicked(): void {
    const selected_nodes = this.projects_graph.getSelectedNodes();

    if (selected_nodes.length == 0) {
      console.warn('impossible sans s\u00e9lectionner un ou plusieurs n\u0153uds !');
      return this.toasterService.showWarn(
        'Impossible sans s\u00e9lectionner un ou plusieurs n\u0153uds !',
      );
    }

    selected_nodes.forEach((node_id) => {
      const data: any = this.projects_graph.getNodeDataByID(node_id);

      switch (data.type) {
        case DataType.PROJECT:
          return this.elements.projects.forEach((project) => {
            if (project.id == data.id) {
              this.elements.projects.splice(
                this.elements.projects.indexOf(project),
                1,
              );
              this.projects_graph.removeNode(node_id);
            }
          });

        case DataType.USER:
          return this.elements.users.forEach((user) => {
            if (user.id == data.id) {
              this.elements.users.splice(this.elements.users.indexOf(user), 1);
              this.projects_graph.removeNode(node_id);
            }
          });

        case DataType.GROUP:
          return this.elements.groups.forEach((group) => {
            if (group.id == data.id) {
              this.elements.groups.splice(
                this.elements.groups.indexOf(group),
                1,
              );
              this.projects_graph.removeNode(node_id);
            }
          });

        default:
          console.warn('WTF ????');
      }
    });
  }

  /**
   * Stores the currently selected item for the information panel.
   *
   * @param item Node data selected in the graph.
   */
  protected onItemSelected(item: any): void {
    this.selected_elements = item;

    let type;
    switch (item.type) {
      case DataType.PROJECT:
        type = NodeType.PROJECT;
        break;
      case DataType.USER:
        type = NodeType.USER;
        break;
      case DataType.GROUP:
        type = NodeType.GROUP;
        break;
      default:
        type = NodeType.PROJECT;
        console.warn('erreur de clic');
        break;
    }

    const selected_id = this.projects_graph.generateID(type, item.id);
    this.projects_graph.selectNode(selected_id);

    this.projects_graph.focus(selected_id);
  }

  /**
   * Searches projects by text and refreshes the graph, honoring topic restrictions.
   *
   * @param query Search string from the input field.
   */
  protected async onSearch(query: string) {
    if (query.length == 0 || this.restriction_topics) {
      this.searchMessageError = '';
      return this.showAllProjectMatchTopic();
    }

    if (query.length < 3) {
      this.searchMessageError = 'Veuillez saisir au moins 3 caractères';
      this.elements.projects = [];
      this.elements.groups = [];
      this.elements.users = [];
      this.projects_graph.clear();
      return;
    }

    if (this.current_search_request) {
      this.current_search_request.unsubscribe();
    }
    this.searchMessageError = '';
    this.elements.projects = [];
    this.elements.groups = [];
    this.elements.users = [];

    this.projects_graph.clear();
    this.isLoading = true;
    this.current_search_request = this.projectAPI
      .getProjectsMatchSearch(query)
      .pipe(
        finalize(() => {
          this.isLoading = false;

          timeout(1200);
          this.projects_graph.fit();
        }),
      )
      .subscribe((projects) => {
        if (projects.length === 0) {
          this.searchMessageError = 'Aucun résultat trouvé';
        }
        projects.forEach((project) => {
          this.createProject(project);
        });
      });
  }

  /**
   * Loads all projects matching the restricted topic when present.
   */
  private showAllProjectMatchTopic() {
    if (!this.restriction_topics) return;

    this.projectAPI
      .getProjectsMatchTopic(this.restriction_topics)
      .subscribe((projects) => {
        projects.forEach((project) => {
          this.createProject(project);
        });
      });
  }

  /**
   * Handles simple node selection and triggers member or project fetch depending on type.
   *
   * @param id Graph node identifier.
   */
  private onSimpleClick(id: string): void {
    const node_type = this.projects_graph.getNodeType(id);
    this.selected_user_projects = [];
    this.selected_group_members = [];

    if (node_type == NodeType.PROJECT) {
      this.selected_elements = this.projects_graph.getNodeDataByID(id);
      return;
    }

    if (node_type == NodeType.GROUP) {
      this.selected_elements = this.projects_graph.getNodeDataByID(id);
      return;
    }

    if (node_type == NodeType.USER) {
      this.selected_elements = this.projects_graph.getNodeDataByID(id);
      return;
    }
  }

  /**
   * Expands a node by fetching and connecting its related entities.
   *
   * @param id_1 Graph node identifier to expand.
   */
  private onDoubleClick(id_1: string): void | Subscription {
    if (!id_1) return;

    const node_id = this.projects_graph.getNodeID(id_1);
    const node_type = this.projects_graph.getNodeType(id_1);

    if (node_type == NodeType.PROJECT) {
      this.projectAPI.getProjectUsers(node_id).subscribe((users) => {
        const inserted_users: any[] = [];
        users.forEach((user) => {
          let elt = { ...user, type: DataType.USER };
          if (!this._elementsAlreadyCreate(elt)) {
            inserted_users.push(user);
            const id_2 = this.createUser(user);
            this.connectNodes(id_1, id_2);
          }
        });
        if (inserted_users.length == 0) {
          this.toasterService.showWarn(
            'Tous les utilisateurs du projet sont affichés !',
          );
        }
      });

      return this.projectAPI.getProjectGroups(node_id).subscribe((groups) => {
        const inserted: any[] = [];
        groups.forEach((group) => {
          let elt = { ...group, type: DataType.GROUP };
          if (!this._elementsAlreadyCreate(elt)) {
            inserted.push(group);
            const id_2 = this.createGroup(group);
            this.connectNodes(id_1, id_2);
          }
        });

        if (inserted.length == 0) {
          this.toasterService.showWarn(
            'Tous les groupes du projet sont affichés !',
          );
        }
      });
    }

    if (node_type == NodeType.USER) {
      return this.userAPI
        .getUserProjects(node_id.toString())
        .subscribe((projects) => {
          const inserted: any[] = [];
          projects.forEach((project) => {
            let elt = { ...project, type: DataType.PROJECT };
            if (!this._elementsAlreadyCreate(elt)) {
              inserted.push(project);
              const id_2 = this.createProject(project);
              this.connectNodes(id_1, id_2);
            }
          });

          if (inserted.length == 0) {
            this.toasterService.showWarn(
              "Tous les projets de l'utilisateur sont affichés !",
            );
          }
        });
    }

    if (node_type == NodeType.GROUP) {
      return this.groupAPI.getGroupProjects(node_id).subscribe((projects) => {
        const inserted: any[] = [];
        projects.forEach((project) => {
          let elt = { ...project, type: DataType.PROJECT };
          if (!this._elementsAlreadyCreate(elt)) {
            inserted.push(project);
            const id_2 = this.createProject(project);
            this.connectNodes(id_1, id_2);
          }
        });

        if (inserted.length == 0) {
          this.toasterService.showWarn(
            'Tous les projets du groupe sont affichés !',
          );
        }
      });
    }
  }

  /**
   * Checks if an element is already created in the local cache.
   *
   * @param element Element to test.
   * @param type Collection type in which to search.
   */
  private _elementsAlreadyCreate(element: any): boolean {
    let liste: any[] = [];

    switch (element.type) {
      case DataType.PROJECT:
        liste = this.elements.projects;
        break;
      case DataType.GROUP:
        liste = this.elements.groups;
        break;
      case DataType.USER:
        liste = this.elements.users;
        break;
    }

    for (let index = 0; index < liste.length; index++) {
      const elt = liste[index];

      if (element.id == elt.id) {
        return true;
      }
    }

    return false;
  }

  /**
   * Clears topic restrictions and reloads the graph when the Delete Topic toolbar action is triggered.
   */
  protected onDeleteTopic(): void {
    this.restriction_topics = undefined;
  }

  /**
   * Removes selected nodes when the Delete key is pressed.
   *
   * @param event Keyboard event from the document listener.
   */
  @HostListener('document:keydown', ['$event'])
  protected onDeleteInput(event: KeyboardEvent): void {
    if (event.key === 'Delete') this.onHideToolClicked();
  }

  protected showHelperPopup(): boolean {
    // Si la page est changé par une redirection depuis la page des sujets alors FALSE
    if (this.restriction_topics) return false;

    // Si aucun elements n'est changé alors TRUE
    if (this.elements.projects.length == 0) return true;

    return false;
  }

  protected onHomeLinkClick(): void {

  }
}
