import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthData } from '../models/auth-data.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token?: string;

  constructor(private http: HttpClient) {}

  getToken() {
    return this.token;
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
      });
  }
}
