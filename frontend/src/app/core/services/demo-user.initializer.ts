import { AuthService } from './auth.service';
import { User } from '../models/user.model';

/**
 * Initialize demo user for development
 * This should be removed in production
 */
export function initializeDemoUser(authService: AuthService): void {
  // Check if user is already logged in
  if (!authService.isAuthenticated) {
    // Create demo user
    const demoUser: User = {
      id: 1,
      username: 'tesfay',
      fullName: 'Tesfay Bsrat',
      email: 'tesfaybsrat26@gmail.com',
      role: 'Super Admin',
      isActive: true
    };

    // Login demo user with fake token
    authService.login(demoUser, 'demo-token-12345');
    
    console.log('Demo user initialized:', demoUser.fullName);
  }
}
