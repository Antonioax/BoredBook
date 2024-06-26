import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { DialogComponent } from '../../components/shared/dialog/dialog.component';
import { LoaderComponent } from "../../components/shared/loader/loader.component";

@Component({
  standalone: true,
  templateUrl: './login.component.html',
  imports: [FormsModule, LoaderComponent],
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;

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
}
