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

  updateProfilePhoto(image: File) {
    console.log(this.authService.getUser().username);
    console.log(this.authService.userSubject);
    let userData = new FormData();
    userData.append('id', this.authService.getUser().id);
    userData.append('email', this.authService.getUser().email);
    userData.append('username', this.authService.getUser().username || '');
    userData.append('image', image, this.authService.getUser().email);

    this.http
      .put<{
        message: String;
        data: {
          _id: string;
          email: string;
          username?: string;
          imagePath?: string;
        };
      }>(BACKEND_URL + this.authService.getUser().id, userData)
      .subscribe({
        next: (data) => {
          console.log(data);
          let updatedUser: User = {
            id: data.data._id,
            email: data.data.email,
            username: data.data.username,
            imagePath: data.data.imagePath,
          };
          this.authService.updateUser(updatedUser);
          this.router.navigate(['/profile']);
        },
        error: (err) => console.log(err),
      });
  }

  updateUsername(username: string) {
    let newUser: User = {
      id: this.authService.getUser().id,
      email: this.authService.getUser().email,
      username: username,
      imagePath: this.authService.getUser().imagePath,
    };

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
