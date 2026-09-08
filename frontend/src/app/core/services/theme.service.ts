import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'qa-platform-theme';
  private currentTheme$ = new BehaviorSubject<Theme>('light');

  constructor() {
    this.initializeTheme();
  }

  /**
   * Initialize theme from localStorage or system preference
   */
  private initializeTheme(): void {
    const savedTheme = this.getStoredTheme();
    const systemTheme = this.getSystemTheme();
    const theme = savedTheme || systemTheme;
    
    this.setTheme(theme, false);
  }

  /**
   * Get theme from localStorage
   */
  private getStoredTheme(): Theme | null {
    const stored = localStorage.getItem(this.THEME_KEY);
    return stored === 'dark' || stored === 'light' ? stored : null;
  }

  /**
   * Get system theme preference
   */
  private getSystemTheme(): Theme {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  /**
   * Set theme
   */
  setTheme(theme: Theme, persist: boolean = true): void {
    const htmlElement = document.documentElement;
    
    if (theme === 'dark') {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }

    this.currentTheme$.next(theme);

    if (persist) {
      localStorage.setItem(this.THEME_KEY, theme);
    }
  }

  /**
   * Toggle between light and dark theme
   */
  toggleTheme(): void {
    const newTheme = this.currentTheme$.value === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  /**
   * Get current theme as observable
   */
  get theme$(): Observable<Theme> {
    return this.currentTheme$.asObservable();
  }

  /**
   * Get current theme value
   */
  get currentTheme(): Theme {
    return this.currentTheme$.value;
  }

  /**
   * Check if dark mode is active
   */
  get isDarkMode(): boolean {
    return this.currentTheme$.value === 'dark';
  }

  /**
   * Observable for dark mode state
   */
  get isDarkMode$(): Observable<boolean> {
    return new BehaviorSubject<boolean>(this.isDarkMode).asObservable();
  }

  /**
   * Listen to system theme changes
   */
  listenToSystemThemeChanges(): void {
    if (window.matchMedia) {
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      darkModeQuery.addEventListener('change', (e) => {
        // Only update if user hasn't manually set a preference
        if (!this.getStoredTheme()) {
          this.setTheme(e.matches ? 'dark' : 'light', false);
        }
      });
    }
  }
}
