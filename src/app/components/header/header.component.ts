import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true,
  imports: [RouterModule],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  authListenerSub!: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authListenerSub = this.authService
      .getAuthStatusListener()
      .subscribe((status) => {
        this.isAuthenticated = status;
      });
  }

  ngOnDestroy() {
    this.authListenerSub.unsubscribe();
  }

  onLogout() {
    this.authService.logoutUser();
  }
}
