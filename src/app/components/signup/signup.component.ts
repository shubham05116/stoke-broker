import { Component } from '@angular/core';
import { StokeService } from '../../services/stoke.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  user = {
    username: '',
    email: '',
    password: ''
  };
  loading = false;
  errorMessage = '';

  constructor(
    private stokeService: StokeService,
    private router: Router
  ) {}

  onSubmit() {
    this.loading = true;
    this.errorMessage = '';

    this.stokeService.signup(this.user)
      .subscribe({
        next: (response) => {
          console.log('Signup successful', response);
          this.loading = false;
          localStorage.setItem('token', response.token);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Signup failed', error);
          this.loading = false;
          this.errorMessage = error.error.message || 'An error occurred during signup';
        }
      });
  }
}
