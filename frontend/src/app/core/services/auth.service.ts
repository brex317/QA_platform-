import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, AuthState } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'qa_platform_auth';
  
  private authState$ = new BehaviorSubject<AuthState>({
    user: null,
    isAuthenticated: false,
    token: null
  });

  constructor() {
    this.loadAuthState();
  }

  /**
   * Load authentication state from localStorage
   */
  private loadAuthState(): void {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        try {
          const authState = JSON.parse(stored);
          this.authState$.next(authState);
        } catch (error) {
          console.error('Failed to parse auth state:', error);
          this.clearAuthState();
        }
      }
    }
  }

  /**
   * Save authentication state to localStorage
   */
  private saveAuthState(state: AuthState): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    }
    this.authState$.next(state);
  }

  /**
   * Clear authentication state
   */
  private clearAuthState(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
    }
    this.authState$.next({
      user: null,
      isAuthenticated: false,
      token: null
    });
  }

  /**
   * Get current auth state as observable
   */
  get authState(): Observable<AuthState> {
    return this.authState$.asObservable();
  }

  /**
   * Get current user
   */
  get currentUser(): User | null {
    return this.authState$.value.user;
  }

  /**
   * Get current user as observable
   */
  get currentUser$(): Observable<User | null> {
    return new BehaviorSubject(this.authState$.value.user).asObservable();
  }

  /**
   * Check if user is authenticated
   */
  get isAuthenticated(): boolean {
    return this.authState$.value.isAuthenticated;
  }

  /**
   * Check if user is authenticated as observable
   */
  get isAuthenticated$(): Observable<boolean> {
    return new BehaviorSubject(this.authState$.value.isAuthenticated).asObservable();
  }

  /**
   * Login user
   */
  login(user: User, token: string): void {
    const authState: AuthState = {
      user,
      isAuthenticated: true,
      token
    };
    this.saveAuthState(authState);
  }

  /**
   * Logout user
   */
  logout(): void {
    this.clearAuthState();
  }

  /**
   * Update user profile
   */
  updateUser(user: User): void {
    const currentState = this.authState$.value;
    if (currentState.isAuthenticated) {
      this.saveAuthState({
        ...currentState,
        user
      });
    }
  }

  /**
   * Get user initials for avatar
   */
  getUserInitials(user: User | null): string {
    if (!user) return 'U';
    
    const names = user.fullName.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return user.fullName.substring(0, 2).toUpperCase();
  }

  /**
   * Get user display name
   */
  getUserDisplayName(user: User | null): string {
    return user?.fullName || 'User';
  }

  /**
   * Get user role
   */
  getUserRole(user: User | null): string {
    return user?.role || 'Guest';
  }
}
