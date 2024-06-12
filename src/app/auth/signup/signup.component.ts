import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  templateUrl: './signup.component.html',
  imports: [FormsModule],
})
export class SignupComponent {
  isLoading = false;

  email: string = '';
  password: string = '';

  constructor(public authService: AuthService) {}

  onSignup(form: NgForm) {
    if (form.invalid) return;

    this.authService.createUser(this.email, this.password);
  }
}
