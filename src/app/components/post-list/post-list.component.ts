import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {
  EventData,
  PaginationComponent,
} from '../pagination/pagination.component';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  standalone: true,
  imports: [PaginationComponent],
})
export class PostListComponent implements OnInit, OnDestroy {
  allPosts: Post[] = [];
  totalPosts = 0;
  pagePosts = 2;
  currentPage = 1;
  pageOptions = [1, 2, 5, 10, 20];

  postSub!: Subscription;

  isLoading: boolean = false;

  constructor(private postService: PostService, private router: Router) {}

  onDelete(id: string) {
    this.isLoading = true;
    this.postService.deletePost(id).subscribe(() => {
      this.postService.getPosts(this.pagePosts, this.currentPage);
    });
  }

  onEdit(id: string) {
    this.router.navigateByUrl('edit/' + id);
  }

  onPageChange(event: any) {
    console.log(event.pageIndex || event.pageIndex === 0);
    if (event.pageIndex || event.pageIndex === 0) {
      this.isLoading = true;
      this.currentPage = event.pageIndex + 1;
      this.pagePosts = event.pageSize;
      this.postService.getPosts(this.pagePosts, this.currentPage);
    }
  }

  ngOnInit() {
    this.isLoading = true;
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
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
  }
}
