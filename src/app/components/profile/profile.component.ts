import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { mimeType } from "../../validators/mime-type.validator";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  isOwner = true;
  user!: User;

  imageForm!: FormGroup;
  imagePreview!: string;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.getUser();

    this.imageForm = new FormGroup({
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });
  }

  onSetUsername(form: NgForm) {
    console.log(form.value.username);
  }

  onSetPhoto() {
    
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
