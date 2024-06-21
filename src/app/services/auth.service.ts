import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthData } from '../models/auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment.development';

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;
  private token?: string;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer!: any;
  private user: User = {
    id: '',
    email: '',
  };

  constructor(private http: HttpClient, private router: Router) {}

  getUser() {
    return this.user;
  }

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
    return this.http.post(BACKEND_URL + 'signup', authData).subscribe({
      next: (data) => {
        console.log(data);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.log(error);
        this.authStatusListener.next(false);
      },
    });
  }

  loginUser(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password,
    };
    this.http
      .post<{
        message: string;
        token: string;
        expiresIn: number;
        userId: string;
        userEmail: string;
        userName: string;
        userProfilePhoto: string;
      }>(BACKEND_URL + 'login', authData)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.token = data.token;
          if (this.token) {
            let newUser: User = {
              id: data.userId,
              email: data.userEmail,
              username: data.userName,
              imagePath: data.userProfilePhoto,
            };
            this.user = newUser;
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            this.setAuthTimer(data.expiresIn);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + data.expiresIn * 1000
            );
            this.saveLocalAuth(this.token, expirationDate, this.user);
            this.router.navigate(['/']);
          }
        },
        error: (error) => {
          console.log(error);
          this.authStatusListener.next(false);
        },
      });
  }

  loginAuto() {
    const auth = this.getLocalAuth();
    if (auth) {
      const now = new Date();
      const expiresIn = auth.expirationDate.getTime() - now.getTime();
      if (expiresIn > 0) {
        this.user = auth.user;
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
    this.user = {
      id: '',
      email: '',
    };
    this.token = undefined;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearLocalAuth();
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    console.log('Expires in: ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logoutUser();
    }, duration * 1000);
  }

  private saveLocalAuth(token: string, expirationDate: Date, user: User) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('user', JSON.stringify(user));
  }

  private getLocalAuth() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userJson = localStorage.getItem('user');

    if (!token || !expirationDate) return;
    let user;
    if (userJson) {
      user = JSON.parse(userJson);
    }

    console.log(user);

    return {
      token: token,
      expirationDate: new Date(expirationDate),
      user: user,
    };
  }

  private clearLocalAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('user');
  }
}
