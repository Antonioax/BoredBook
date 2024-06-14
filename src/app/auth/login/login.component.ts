import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { DialogComponent } from '../../components/dialog/dialog.component';

@Component({
  standalone: true,
  templateUrl: './login.component.html',
  imports: [FormsModule, DialogComponent],
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;

  isDialog = false;
  dialogText: string = '';

  email: string = '';
  password: string = '';

  authListenerSub!: Subscription;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authListenerSub = this.authService
      .getAuthStatusListener()
      .subscribe((status) => {
        if (!status) {
          this.isLoading = false;
          this.openDialog('Login failed! Please try again.');
        }
      });
  }

  ngOnDestroy() {
    this.authListenerSub.unsubscribe();
  }

  onLogin(form: NgForm) {
    if (form.invalid) return;
    this.isLoading = true;
    this.authService.loginUser(this.email, this.password);
  }

  openDialog(message: string) {
    this.isDialog = true;
    this.dialogText = message;
  }
}
