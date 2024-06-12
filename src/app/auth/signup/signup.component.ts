import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  standalone: true,
  templateUrl: './signup.component.html',
  imports: [FormsModule],
})
export class SignupComponent {
  isLoading = false;

  email: string = '';
  password: string = '';

  onSignup(form: NgForm) {
    console.log(form.value);
  }
}
