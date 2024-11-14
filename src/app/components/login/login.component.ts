import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StokeService } from '../../services/stoke.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  user = {
    email: '',
    password: '',
  };
  loading = false;
  errorMessage = '';

  constructor(private stokeService: StokeService, private router: Router) {}

  onSubmit() {
    if (this.loading) return;

    this.loading = true;
    this.errorMessage = '';

    this.stokeService.login(this.user).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        localStorage.setItem('token', response.
            access_token);
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login failed', error);
        this.loading = false;
        this.errorMessage = error.error?.message || 'Invalid email or password';
      },
    });
  }
}
