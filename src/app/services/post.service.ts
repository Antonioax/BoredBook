import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Post } from '../models/post.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  allPosts = new BehaviorSubject<Post[]>([]);

  constructor(private http: HttpClient) {}

  addPost(newPost: Post) {
    this.http
      .post<{ message: string }>('http://localhost:3000/api/posts', newPost)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.allPosts.next([...this.allPosts.value, newPost]);
        },
      });
  }
  //Ml5wv87L6b5qRpdn;
  getPosts() {
    this.http
      .get<{ message: string; posts: Post[] }>(
        'http://localhost:3000/api/posts'
      )
      .subscribe({
        next: (data) => {
          this.allPosts.next(data.posts);
          console.log(data);
        },
      });
  }
}
