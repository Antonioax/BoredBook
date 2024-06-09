import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  standalone: true,
})
export class PostListComponent implements OnInit, OnDestroy {
  allPosts: Post[] = [];

  postSub!: Subscription;

  constructor(private postService: PostService, private router: Router) {}

  onDelete(id: string) {
    this.postService.deletePost(id);
  }

  onEdit(id: string) {
    this.router.navigateByUrl('edit/' + id);
  }

  ngOnInit() {
    this.postSub = this.postService.allPosts.subscribe({
      next: (data) => (this.allPosts = data),
    });
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
  }
}
