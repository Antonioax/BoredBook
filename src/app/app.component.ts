import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PostCreateComponent } from './components/post-create/post-create.component';
import { HeaderComponent } from './components/header/header.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { FooterComponent } from './components/footer/footer.component';
import { PostService } from './services/post.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    PostCreateComponent,
    PostListComponent,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.loginAuto();
  }
}
