import { Component } from '@angular/core';

@Component({
  selector: 'app-project-helper',
  imports: [],
  templateUrl: './project-helper.component.html',
  styleUrl: './project-helper.component.scss',
})
export class ProjectHelperComponent {
  protected visible: boolean = false;

  protected helper_summary: { image: string; text: string }[] = [
    {
      image: 'icons/icon-project/icon-project-unselected.svg',
      text: 'projet : noeud principal qui représente un repo et ses liens.',
    },
    {
      image: 'icons/icon-user/icon-user-unselected.svg',
      text: 'utilisateur : personne liée aux projets et aux groupes.',
    },
    {
      image: 'icons/icon-group/icon-group-unselected.svg',
      text: 'groupe : ensemble d’utilisateurs rattachés à un projet.',
    },
  ];

  protected helper_items: {
    title: string;
    description: string;
    image: string;
    link?: string;
  }[] = [
    {
      title: 'Explorer',
      description:
        "permet d'afficher les liaisons d'un noeud sélectionné. exemple : si vous sélectionnez un utilisateur, vous verrez ses projets et ses groupes reliés.",
      image: 'icons/icon-expend.svg',
    },
    {
      title: 'Cacher la sélection',
      description:
        'sélectionnez un ou plusieurs noeuds puis cliquez ici pour les supprimer de la vue.',
      image: 'icons/icon-hide.svg',
    },
    {
      title: 'Copier le lien',
      description:
        "copie l'url de votre graphe actuel pour que vous puissiez la coller dans une autre fenêtre et retrouver le même graphe.",
      image: 'icons/icon-copy.svg',
    },
    {
      title: 'Documentation complète',
      description:
        "consultez le wiki du projet pour une documentation détaillée et des guides d'utilisation.",
      image: 'icons/icon-info.svg',
      link: 'https://git.univ-lemans.fr/tfore/forge-explorer/-/wikis/home',
    },
  ];

  protected show_helper_panel: boolean = false;

  show(): void {
    this.visible = true;
    console.log('show');
  }

  toogle(): void {
    this.visible = !this.visible;
    console.log('Toogle');
  }

  hide(): void {
    this.visible = false;
    console.log('hide');
  }
}
