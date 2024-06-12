import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  standalone: true,
  templateUrl: './login.component.html',
  imports: [FormsModule],
})
export class LoginComponent {
  isLoading = false;

  email: string = '';
  password: string = '';

  onLogin(form: NgForm) {
    console.log(form.value);
  }
}
