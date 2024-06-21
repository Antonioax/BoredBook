import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { mimeType } from '../../validators/mime-type.validator';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  isOwner = true;
  isEditUsername = false;
  isEditPhoto = false;
  user!: User;
  userSub!: Subscription;

  imageForm!: FormGroup;
  imagePreview!: string;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.user = this.authService.getUser();

    this.userSub = this.authService.userSubject.subscribe({
      next: (user) => {
        this.user = user;
        this.isEditUsername = false;
        this.imagePreview = '';
      },
      error: (err) => {
        this.isEditUsername = false;
        this.imagePreview = '';
      },
    });

    this.imageForm = new FormGroup({
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });
  }

  onSetUsername(form: NgForm) {
    this.userService.updateUser(form.value.username, this.user.imagePath);
  }

  onSetPhoto() {
    this.userService.updateUser(this.user.username, this.imageForm.value.image);
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.imageForm.patchValue({ image: file });
      this.imageForm.get('image')?.updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}
