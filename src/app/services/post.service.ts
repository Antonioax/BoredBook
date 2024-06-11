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

  addPost(newPost: Post, image: File) {
    const postData = new FormData();
    postData.append('title', newPost.title);
    postData.append('content', newPost.content);
    postData.append('image', image, newPost.title);
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
              imagePath: post.imagePath,
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
                imagePath: post.imagePath,
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
      imagePath: string;
    }>('http://localhost:3000/api/posts/' + id);
  }

  updatePost(updatedPost: Post, image: string | File) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', updatedPost.id);
      postData.append('title', updatedPost.title);
      postData.append('content', updatedPost.content);
      postData.append('image', image, updatedPost.title);
    } else {
      postData = {
        id: updatedPost.id,
        title: updatedPost.title,
        content: updatedPost.content,
        imagePath: image,
      };
    }

    this.http
      .put('http://localhost:3000/api/posts/' + updatedPost.id, postData)
      .subscribe({
        next: (data) => {
          console.log(data);
          const replaceIndex = this.allPosts.value.findIndex(
            (p) => p.id === updatedPost.id
          );
          const post: Post = {
            id: updatedPost.id,
            title: updatedPost.title,
            content: updatedPost.content,
            imagePath: "",
          };
          const replacePosts = [...this.allPosts.value];
          replacePosts[replaceIndex] = post;
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
