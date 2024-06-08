import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  allPosts = new BehaviorSubject<Post[]>([]);

  addPost(newPost: Post) {
    this.allPosts.next([...this.allPosts.value, newPost]);
    console.log(this.allPosts);
  }
}
