import { Routes } from '@angular/router';
import { PostListComponent } from './components/post-list/post-list.component';
import { PostCreateComponent } from './components/post-create/post-create.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'posts',
    pathMatch: 'full',
  },
  {
    path: 'posts',
    component: PostListComponent,
    title: 'Posts',
  },
  {
    path: 'create',
    component: PostCreateComponent,
    title: 'Create',
  },
];
