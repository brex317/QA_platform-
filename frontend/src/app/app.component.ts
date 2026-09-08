import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { initializeDemoUser } from './core/services/demo-user.initializer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
  styles: []
})
export class AppComponent implements OnInit {
  title = 'QA-Platform ERP';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Initialize demo user for development
    // TODO: Remove this in production and implement proper login
    initializeDemoUser(this.authService);
  }
}
