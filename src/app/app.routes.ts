import { Routes } from '@angular/router';
import { PostListComponent } from './components/post-list/post-list.component';
import { PostCreateComponent } from './components/post-create/post-create.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'posts',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
  },
  {
    path: 'signup',
    component: SignupComponent,
    title: 'Register',
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
    canActivate: [AuthGuard],
  },
  {
    path: 'edit/:postId',
    component: PostCreateComponent,
    title: 'Create',
    canActivate: [AuthGuard],
  },
];
