import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from 'ngx-forge-map';

import { AccordionModule } from 'primeng/accordion';

/**
 * UtilisateurInformation displays details about a selected user and their projects.
 *
 * @remarks
 * Provides a toggle to show or hide the projects list for a concise UI.
 *
 * @selector app-utilisateur-information
 * @template ./utilisateur-informations.component.html
 * @style ./utilisateur-informations.component.scss
 */
@Component({
  selector: 'app-utilisateur-information',
  imports: [CommonModule, AccordionModule],
  templateUrl: './utilisateur-informations.component.html',
  styleUrl: './utilisateur-informations.component.scss',
})
export class UtilisateurInformation {
  @Input() user?: User;
  @Input() projects: any[] = [];
}
