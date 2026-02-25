import { Subscription } from 'rxjs';
import {
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import { GroupApiService, UserApiService } from 'ngx-forge-map';

import { UtilisateurInformation } from './utilisateur-information/utilisateur-informations.component';
import { ProjectsInformations } from './projects-informations/projects-informations.component';
import { GroupInformations } from './group-informations/group-informations.component';

@Component({
  selector: 'app-informations',
  imports: [ProjectsInformations, GroupInformations, UtilisateurInformation],
  templateUrl: './informations.component.html',
  styleUrl: './informations.component.scss',
})
export class InformationsComponent implements OnChanges {
  @Input() item: any;

  protected group_members: any[] = [];
  protected user_projects: any[] = [];

  private current_user_projects_request?: Subscription;
  private current_group_members_request?: Subscription;

  private readonly group_API = inject(GroupApiService);
  private readonly user_API = inject(UserApiService);

  ngOnChanges(changes: SimpleChanges): void {
    const i: any = changes['item'].currentValue;
    console.log(i);
    if (i.type == 'user') {
      this.item = {...this.item, image_path: 'icons/icon-user/icon-user-unselected.svg'};
      this.loadUserProjects();
    }
    if (i.type == 'group') {
      this.item = {...this.item, image_path: 'icons/icon-group/icon-group-unselected.svg'};
      this.loadGroupMembers();
    }
    if (i.type == 'project') {
      this.item = {
        ...this.item,
        image_path: 'icons/icon-project/icon-project-unselected.svg',
      };
    }
  }

  onCloseButton(): void {
    this.item = undefined;
    console.log("close button used !");
  }

  private loadGroupMembers(): void {
    if (!this.item && this.item.id !== 0) {
      this.group_members = [];
      return;
    }

    if (this.current_group_members_request) {
      this.current_group_members_request.unsubscribe();
    }

    this.group_members = [];

    this.current_group_members_request = this.group_API
      .getGroupMembers(this.item.full_path)
      .subscribe({
        next: (resp) => {
          this.group_members = resp || [];
        },
        error: () => {
          this.group_members = [];
        },
      });
  }

  private loadUserProjects(): void {
    if (!this.item && this.item.is !== 0) {
      this.user_projects = [];
      return;
    }

    if (this.current_user_projects_request) {
      this.current_user_projects_request.unsubscribe();
    }

    this.user_projects = [];

    this.current_user_projects_request = this.user_API
      .getUserProjects(this.item.id)
      .subscribe({
        next: (projects) => {
          this.user_projects = projects || [];
        },
        error: () => {
          this.user_projects = [];
        },
      });
  }
}
