import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {
  EventData,
  PaginationComponent,
} from '../pagination/pagination.component';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  standalone: true,
  imports: [PaginationComponent],
})
export class PostListComponent implements OnInit, OnDestroy {
  allPosts: Post[] = [];
  totalPosts = 0;
  pagePosts = 10;
  currentPage = 1;
  pageOptions = [1, 2, 5, 10, 20];

  postSub!: Subscription;

  isLoading: boolean = false;

  authListenerSub!: Subscription;
  isAuthenticated: boolean = false;

  user!: User;
  userSub!: Subscription;

  constructor(
    private postService: PostService,
    private router: Router,
    private authService: AuthService
  ) {}

  onDelete(id: string) {
    this.isLoading = true;
    this.postService.deletePost(id).subscribe({
      next: () => {
        this.postService.getPosts(this.pagePosts, this.currentPage);
      },
      error: () => (this.isLoading = false),
    });
  }

  onEdit(id: string) {
    this.router.navigateByUrl('edit/' + id);
  }

  onPageChange(event: any) {
    if (event.pageIndex || event.pageIndex === 0) {
      this.isLoading = true;
      this.currentPage = event.pageIndex + 1;
      this.pagePosts = event.pageSize;
      this.postService.getPosts(this.pagePosts, this.currentPage);
    }
  }

  ngOnInit() {
    this.isLoading = true;

    this.user = this.authService.getUser();
    this.userSub = this.authService.userSubject.subscribe({
      next: (user) => (this.user = user),
    });

    this.postService
      .returnPosts(this.pagePosts, this.currentPage)
      .then(() => {
        this.postSub = this.postService.allPosts.subscribe({
          next: (data) => {
            this.allPosts = data.posts;
            this.totalPosts = data.postCount;
            this.isLoading = false;
          },
        });
      })
      .catch((err) => console.log(err));
    this.isAuthenticated = this.authService.getIsAuth();
    this.authListenerSub = this.authService
      .getAuthStatusListener()
      .subscribe((status) => {
        this.isAuthenticated = status;
        this.user = this.authService.getUser();
      });
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
    this.authListenerSub.unsubscribe();
  }
}
