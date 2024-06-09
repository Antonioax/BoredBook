import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post.service';
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrl: "./post-create.component.scss",
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class PostCreateComponent {
  title: string = '';
  content: string = '';

  constructor(private postService: PostService) {}

  onSave(form: NgForm) {
    if (form.invalid) return;

    let newPost: Post = {
      id: "",
      title: this.title,
      content: this.content,
    };

    this.postService.addPost(newPost);
    form.reset();
  }
}
