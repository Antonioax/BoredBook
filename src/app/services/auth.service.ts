import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthData } from '../models/auth-data.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;
  private token?: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient) {}

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
      .post<{ message: string; token: string }>(
        'http://localhost:3000/api/user/login',
        authData
      )
      .subscribe((data) => {
        console.log(data);
        this.token = data.token;
        if (this.token) {
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
        }
      });
  }
}
