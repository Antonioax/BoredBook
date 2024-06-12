import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Post } from '../models/post.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  allPosts = new BehaviorSubject<{ posts: Post[]; postCount: number }>({
    posts: [],
    postCount: 0,
  });

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
          this.router.navigateByUrl('posts');
        },
      });
  }

  getPosts(pageSize: number, currentPage: number) {
    const queryParams = `?pageSize=${pageSize}&currentPage=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; postCount: number }>(
        'http://localhost:3000/api/posts' + queryParams
      )
      .pipe(
        map((data) => {
          return {
            posts: data.posts.map((post: any) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
              };
            }),
            postCount: data.postCount,
          };
        })
      )
      .subscribe({
        next: (data) => {
          this.allPosts.next(data);
          console.log(data);
        },
      });
  }

  returnPosts(pageSize: number, currentPage: number): Promise<Post[]> {
    const queryParams = `?pageSize=${pageSize}&currentPage=${currentPage}`;
    return new Promise((resolve, reject) => {
      this.http
        .get<{ message: string; posts: any; postCount: number }>(
          'http://localhost:3000/api/posts' + queryParams
        )
        .pipe(
          map((data) => {
            return {
              posts: data.posts.map((post: any) => {
                return {
                  title: post.title,
                  content: post.content,
                  id: post._id,
                  imagePath: post.imagePath,
                };
              }),
              postCount: data.postCount,
            };
          })
        )
        .subscribe({
          next: (data) => {
            this.allPosts.next(data);
            resolve(this.allPosts.value.posts);
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
          this.router.navigateByUrl('posts');
        },
      });
  }

  deletePost(id: string) {
    return this.http.delete('http://localhost:3000/api/posts/' + id);
  }
}
