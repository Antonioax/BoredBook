import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  templateUrl: './signup.component.html',
  imports: [FormsModule],
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;

  email: string = '';
  password: string = '';

  authListenerSub!: Subscription;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authListenerSub = this.authService
      .getAuthStatusListener()
      .subscribe((status) => {
        if (!status) this.isLoading = false;
      });
  }

  ngOnDestroy() {
    this.authListenerSub.unsubscribe();
  }

  onSignup(form: NgForm) {
    if (form.invalid) return;
    this.isLoading = true;
    this.authService.createUser(this.email, this.password);
  }
}
