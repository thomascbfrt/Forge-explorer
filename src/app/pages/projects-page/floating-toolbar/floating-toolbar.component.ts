/**
 * FloatingToolbar renders quick actions to control the projects graph view.
 *
 * @remarks
 * Emits toolbar events to its parent component and relies on `ToolBarItem` identifiers.
 *
 * @selector app-floating-toolbar
 * @template ./floating-toolbar.component.html
 * @style ./floating-toolbar.component.scss
 */
import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToolBarItem } from '../../../models/toolbar-item';

@Component({
  selector: 'app-floating-toolbar',
  imports: [CommonModule],
  templateUrl: './floating-toolbar.component.html',
  styleUrl: './floating-toolbar.component.scss',
})
export class FloatingToolbar {
  @Output() toolClicked = new EventEmitter<ToolBarItem>();

  buttons = [
    { id: ToolBarItem.EXPEND, text: 'Explorer', image: 'icons/icon-expend.svg' },
    { id: ToolBarItem.HIDE, text: 'Cacher la sélection', image: 'icons/icon-hide.svg' },
    { id: ToolBarItem.COPY, text: 'Copier le graphe dans le presse papier', image: 'icons/icon-copy.svg' },
    { id: ToolBarItem.DOC, text: 'Ouvrir la documentation', image: 'icons/icon-help.svg' },
  ];

  /**
   * Emits the clicked toolbar item to parent listeners.
   *
   * @param tool_id Identifier of the pressed toolbar button.
   */
  protected toolClick(tool_id: ToolBarItem): void {
    return this.toolClicked.emit(tool_id);
  }
}
