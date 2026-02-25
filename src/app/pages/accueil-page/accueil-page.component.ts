/**
 * AccueilComponent is the main component for the "accueil" (home) page.
 *
 * @remarks
 * This component uses Angular's standalone component feature and imports the RouterLink directive
 * for navigation within the application.
 *
 * @selector app-accueil
 * @template ./accueil-page.component.html
 * @style ./accueil-page.component.scss
 */
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UrlManager } from '../../services/url-manager/url-manager';

@Component({
  selector: 'app-accueil',
  imports: [RouterLink],
  templateUrl: './accueil-page.component.html',
  styleUrl: './accueil-page.component.scss',
})
export class AccueilComponent implements OnInit {
  showExplanation = false;

  /**
   * Injects router and URL manager utilities.
  */
  private readonly router: Router = inject(Router);
  private readonly urlManager: UrlManager = inject(UrlManager);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  /**
   * Initializes the component by restoring encoded URL params and redirecting to projects.
   */
  ngOnInit(): void {
    const t = this.route.snapshot.queryParamMap;
    if (t.keys.length != 0) {
      const params = this.urlManager.getUncodedUrlParams((e: string) => {
        return e != '' ? e.split(',').map((e) => Number(e)) : [];
      });

      return this.redirect_projects_view(params);
    }
  }

  /**
   * Listens to scroll events to show/hide the explanation section.
   */
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.showExplanation = scrollPosition > 200;
  }

  /**
   * Navigates to the projects page with the decoded state.
   *
   * @param data Data extracted from the URL to restore the selection.
   */
  private redirect_projects_view(data: any): void {
    this.router.navigate(['/projects'], { state: { data: data } });
  }
}
