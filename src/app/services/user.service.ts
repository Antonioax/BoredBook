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

  updateUser(username: string | undefined, image: File | string | undefined) {
    let userData: User | FormData;

    if (typeof image === 'object') {
      userData = new FormData();
      userData.append('id', this.authService.getUser().id);
      userData.append('email', this.authService.getUser().email);
      userData.append('username', this.authService.getUser().username || '');
      userData.append('image', image, this.authService.getUser().email);
    } else {
      userData = {
        id: this.authService.getUser().id,
        email: this.authService.getUser().email,
        username: username,
        imagePath: this.authService.getUser().imagePath,
      };
    }

    console.log(this.authService.getUser().id);

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
}
