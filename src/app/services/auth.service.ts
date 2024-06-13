import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthData } from '../models/auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;
  private token?: string;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer!: any;

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password,
    };
    this.http
      .post('http://localhost:3000/api/user/signup', authData)
      .subscribe((data) => {
        console.log(data);
      });
  }

  loginUser(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password,
    };
    this.http
      .post<{ message: string; token: string; expiresIn: number }>(
        'http://localhost:3000/api/user/login',
        authData
      )
      .subscribe((data) => {
        console.log(data);
        this.token = data.token;
        if (this.token) {
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.setAuthTimer(data.expiresIn);
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + data.expiresIn * 1000
          );
          this.saveLocalAuth(this.token, expirationDate);
          this.router.navigate(['/']);
        }
      });
  }

  loginAuto() {
    const auth = this.getLocalAuth();
    if (auth) {
      const now = new Date();
      const expiresIn = auth.expirationDate.getTime() - now.getTime();
      if (expiresIn > 0) {
        this.token = auth.token;
        this.isAuthenticated = true;
        this.setAuthTimer(expiresIn / 1000);
        this.authStatusListener.next(true);
      }
    } else {
      return;
    }
  }

  logoutUser() {
    this.token = undefined;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    console.log('Expires in: ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logoutUser();
    }, duration * 1000);
  }

  private saveLocalAuth(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private getLocalAuth() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');

    if (!token || !expirationDate) return;
    return {
      token: token,
      expirationDate: new Date(expirationDate),
    };
  }

  private clearLocalAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }
}
