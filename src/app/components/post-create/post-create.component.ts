import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.scss',
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class PostCreateComponent implements OnInit {
  title: string = '';
  content: string = '';

  mode = 'create';
  private postId?: string | null;
  private post?: Post;

  constructor(private postService: PostService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.postId &&
          this.postService.getPost(this.postId).subscribe((data) => {
            this.post = {
              id: data._id,
              title: data.title,
              content: data.content,
            };
            this.title = this.post.title;
            this.content = this.post.content;
          });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSave(form: NgForm) {
    if (form.invalid) return;

    let newPost: Post = {
      id: this.postId || '',
      title: this.title,
      content: this.content,
    };

    this.mode == 'create'
      ? this.postService.addPost(newPost)
      : this.postService.updatePost(newPost);

    form.reset();
  }
}
