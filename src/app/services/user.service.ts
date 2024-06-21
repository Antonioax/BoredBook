import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  updateUsername(username: string) {
    let newUser: User = {
      id: this.authService.getUser().id,
      email: this.authService.getUser().email,
      username: username,
      imagePath: this.authService.getUser().imagePath,
    };

    console.log(newUser);

    this.http
      .put<{
        message: String;
        data: {
          _id: string;
          email: string;
          username?: string;
          imagePath?: string;
        };
      }>(BACKEND_URL + newUser.id, newUser)
      .subscribe({
        next: (data) => {
          let updatedUser: User = {
            id: data.data._id,
            email: data.data.email,
            username: data.data.username,
            imagePath: data.data.imagePath,
          };
          this.authService.updateUser(updatedUser);
        },
        error: (err) => console.log(err),
      });
  }
}
