import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Input } from '@angular/core';

import { AccordionModule } from 'primeng/accordion';
import { Group } from 'ngx-forge-map';

/**
 * GroupInformations displays details of a selected group and its members.
 *
 * @remarks
 * Shows member list on demand using a simple toggle.
 *
 * @selector app-group-informations
 * @template ./group-informations.html
 * @style ./group-informations.scss
 */
@Component({
  selector: 'app-group-informations',
  imports: [CommonModule, AccordionModule],
  templateUrl: './group-informations.component.html',
  styleUrl: './group-informations.component.scss',
})
export class GroupInformations {
  @Input() group?: Group;
  @Input() members: any[] = [];
}
