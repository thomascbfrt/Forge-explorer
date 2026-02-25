import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { Project, ProjectApiService } from 'ngx-forge-map';
import { AccordionModule } from 'primeng/accordion';
import { MarkdownModule } from 'ngx-markdown';

/**
 * ProjectsInformations renders detailed information and README content for a project.
 *
 * @remarks
 * Listens to project input changes to refresh the displayed README content.
 *
 * @selector app-projects-informations
 * @template ./projects-informations.html
 * @style ./projects-informations.scss
 */
@Component({
  selector: 'app-projects-informations',
  imports: [MarkdownModule, CommonModule, AccordionModule],
  templateUrl: './projects-informations.component.html',
  styleUrl: './projects-informations.component.scss',
})
export class ProjectsInformations implements OnInit, OnChanges {
  @Input() project?: Project;
  protected readme: string = '';

  /**
   * Injects the project API service used to load README content.
   */
  private readonly projectAPI: ProjectApiService = inject(ProjectApiService);

  /**
   * Refreshes the README when a new project is provided via the input binding.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['project']) {
      this.getReadme();
    }
  }

  /**
   * Loads the README for the initial project on component init.
   */
  ngOnInit(): void {
    this.getReadme();
  }

  /**
   * Retrieves the README markdown for the current project and stores it.
   */
  protected getReadme(): void {
    this.projectAPI.getReadmeProject(this.project!.id).subscribe((readme) => {
      this.readme = readme;
    });
  }
}
