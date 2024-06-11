import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Post } from '../models/post.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  allPosts = new BehaviorSubject<Post[]>([]);

  constructor(private http: HttpClient, private router: Router) {}

  addPost(newPost: Post) {
    const postData = new FormData();
    postData.append('title', newPost.title);
    postData.append('content', newPost.content);
    postData.append('image', newPost.image, newPost.title);
    this.http
      .post<{ message: string; post: Post }>(
        'http://localhost:3000/api/posts',
        postData
      )
      .subscribe({
        next: (data) => {
          const post = data.post;
          console.log(data);
          this.allPosts.next([...this.allPosts.value, post]);
          this.router.navigateByUrl('posts');
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
              image: post.imagePath
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

  returnPosts(): Promise<Post[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get<{ message: string; posts: any }>('http://localhost:3000/api/posts')
        .pipe(
          map((data) => {
            return data.posts.map((post: any) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                image: post.imagePath
              };
            });
          })
        )
        .subscribe({
          next: (data: Post[]) => {
            this.allPosts.next(data);
            resolve(this.allPosts.value);
            console.log(data);
          },
          error: (err) => reject(err),
        });
    });
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      image: File;
    }>('http://localhost:3000/api/posts/' + id);
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
          this.router.navigateByUrl('posts');
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
