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

  getPost(id: string) {
    return this.http.get<{_id: string, title: string, content: string}>('http://localhost:3000/api/posts/' + id);
  }

  updatePost(updatedPost: Post) {
    this.http
      .put('http://localhost:3000/api/posts/' + updatedPost.id, updatedPost)
      .subscribe({
        next: (data) => {
          console.log(data);
          const replaceIndex = this.allPosts.value.findIndex(
            (p) => p.id === updatedPost.id
          );
          const replacePosts = [...this.allPosts.value];
          replacePosts[replaceIndex] = updatedPost;
          this.allPosts.next(replacePosts);
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
