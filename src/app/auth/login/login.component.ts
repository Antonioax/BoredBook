import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  templateUrl: './login.component.html',
  imports: [FormsModule],
})
export class LoginComponent {
  isLoading = false;

  email: string = '';
  password: string = '';

  constructor(public authService: AuthService) {}

  onLogin(form: NgForm) {
    if (form.invalid) return;

    this.authService.loginUser(this.email, this.password);
  }
}
