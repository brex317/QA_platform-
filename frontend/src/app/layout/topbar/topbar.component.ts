import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent],
  template: `
    <header class="bg-white dark:bg-dark-surface border-b border-gray-200/80 dark:border-dark-border sticky top-0 z-30">
      <div class="px-6 py-3.5">
        <div class="flex items-center justify-between">
          <!-- Left: Hamburger + Breadcrumb + Subtitle -->
          <div class="flex items-center gap-4">
            <button
              (click)="onSidebarToggle()"
              class="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div>
              <app-breadcrumb></app-breadcrumb>
              <p class="text-xs text-gray-400 dark:text-gray-400 mt-0.5 font-normal">
                Welcome back, {{ userDisplayName }}! Here's what's happening today.
              </p>
            </div>
          </div>

          <!-- Right: Dark mode toggle, Notification bell, User avatar profile pill -->
          <div class="flex items-center gap-4">
            <!-- Theme toggle -->
            <button
              (click)="toggleTheme()"
              class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <svg 
                *ngIf="(themeService.isDarkMode$ | async)"
                class="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <svg 
                *ngIf="!(themeService.isDarkMode$ | async)"
                class="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>

            <!-- Notifications -->
            <button class="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-sky-500 rounded-full"></span>
            </button>

            <!-- User profile avatar pill -->
            <div class="relative">
              <button
                (click)="toggleUserMenu()"
                class="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity">
                <div class="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                  {{ userInitials }}
                </div>
                <div class="text-left hidden sm:block">
                  <p class="text-xs font-bold text-gray-900 dark:text-dark-text leading-tight">
                    {{ userDisplayName }}
                  </p>
                  <p class="text-[11px] text-gray-400 leading-tight">
                    {{ userRole }}
                  </p>
                </div>
                <svg class="w-4 h-4 text-gray-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Dropdown menu -->
              <div 
                *ngIf="isUserMenuOpen"
                class="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-surface rounded-xl shadow-lg border border-gray-100 dark:border-dark-border py-2 z-50">
                <button
                  (click)="logout()"
                  class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 transition-colors font-medium">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  `
})
export class TopbarComponent implements OnInit {
  @Input() isSidebarCollapsed = false;
  @Output() sidebarToggle = new EventEmitter<void>();

  isUserMenuOpen = false;
  currentUser: User | null = null;
  userDisplayName = 'Tesfay Bsrat';
  userRole = 'Super Admin';
  userInitials = 'T';

  constructor(
    public themeService: ThemeService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.authState.subscribe(state => {
      this.currentUser = state.user;
      this.updateUserDisplay();
    });

    if (typeof document !== 'undefined') {
      document.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        if (!target.closest('.relative')) {
          this.isUserMenuOpen = false;
        }
      });
    }
  }

  private updateUserDisplay(): void {
    this.userDisplayName = this.authService.getUserDisplayName(this.currentUser);
    this.userRole = this.authService.getUserRole(this.currentUser);
    this.userInitials = this.authService.getUserInitials(this.currentUser);
  }

  onSidebarToggle(): void {
    this.sidebarToggle.emit();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  logout(): void {
    this.isUserMenuOpen = false;
    this.authService.logout();
    window.location.reload();
  }
}
