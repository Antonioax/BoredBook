import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  standalone: true,
})
export class PostListComponent implements OnInit, OnDestroy {
  allPosts: Post[] = [];

  postSub!: Subscription;

  constructor(private postService: PostService) {}

  onDelete(post: Post) {}

  onEdit(post: Post) {}

  ngOnInit() {
    this.postSub = this.postService.allPosts.subscribe({
      next: (data) => (this.allPosts = data),
    });
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
  }
}
