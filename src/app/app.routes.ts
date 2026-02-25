import { ProjectsComponent } from './pages/projects-page/projects-page.component';
import { AccueilComponent } from './pages/accueil-page/accueil-page.component';
import { TopicsComponent } from './pages/topics-page/topics-page.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'topics',
    component: TopicsComponent,
  },
  {
    path: 'projects',
    component: ProjectsComponent,
  },
  {
    path: '',
    component: AccueilComponent,
  }
];
