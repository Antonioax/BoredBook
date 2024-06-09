import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
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
      .post<{ message: string; postId: string }>(
        'http://localhost:3000/api/posts',
        newPost
      )
      .subscribe({
        next: (data) => {
          const postId = data.postId;
          newPost.id = postId;
          console.log(data);
          this.allPosts.next([...this.allPosts.value, newPost]);
        },
      });
  }

  getPosts() {
    this.http
      .get<{ message: string; posts: any }>('http://localhost:3000/api/posts')
      .pipe(
        map((data) => {
          return data.posts.map((post: any) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
            };
          });
        })
      )
      .subscribe({
        next: (data: Post[]) => {
          this.allPosts.next(data);
          console.log(data);
        },
      });
  }

  deletePost(id: string) {
    this.http.delete('http://localhost:3000/api/posts/' + id).subscribe({
      next: (data) => {
        console.log(data);
        const updatedPosts = this.allPosts.value.filter(
          (post) => post.id !== id
        );
        this.allPosts.next(updatedPosts);
      },
    });
  }
}
