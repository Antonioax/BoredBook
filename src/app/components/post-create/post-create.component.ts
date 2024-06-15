import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { mimeType } from '../../validators/mime-type.validator';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.scss',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class PostCreateComponent implements OnInit, OnDestroy {
  mode = 'create';
  private postId?: string | null;
  private post?: Post;
  imagePreview!: string;

  isLoading: boolean = false;

  form!: FormGroup;

  authListenerSub!: Subscription;

  constructor(
    private postService: PostService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authListenerSub = this.authService.getAuthStatusListener().subscribe({
      next: () => (this.isLoading = false),
    });
    
    this.form = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required] }),
      content: new FormControl(null, {
        validators: [Validators.required],
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postId &&
          this.postService.getPost(this.postId).subscribe((data) => {
            this.post = {
              id: data._id,
              title: data.title,
              content: data.content,
              imagePath: data.imagePath,
              creatorId: data.creatorId,
              creatorEmail: data.creatorEmail,
            };
            this.form.setValue({
              title: this.post.title,
              content: this.post.content,
              image: this.post.imagePath,
            });
            this.imagePreview = this.post.imagePath;
            this.isLoading = false;
          });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  ngOnDestroy() {
    this.authListenerSub.unsubscribe();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.form.patchValue({ image: file });
      this.form.get('image')?.updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSave() {
    if (this.form.invalid) return;

    this.isLoading = true;

    let newPost: Post = {
      id: this.postId || '',
      title: this.form.value.title,
      content: this.form.value.content,
      imagePath: '',
      creatorEmail: '',
      creatorId: '',
    };

    this.mode == 'create'
      ? this.postService.addPost(newPost, this.form.value.image)
      : this.postService.updatePost(newPost, this.form.value.image);

    this.form.reset();
  }
}
