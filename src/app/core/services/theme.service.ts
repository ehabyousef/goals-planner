import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_KEY = 'theme-preference';

  // Signal to track dark mode state
  isDarkMode = signal<boolean>(this.getInitialTheme());

  constructor() {
    // Apply theme on initialization and when signal changes
    effect(() => {
      this.applyTheme(this.isDarkMode());
    });
  }

  /**
   * Get initial theme from localStorage or system preference
   */
  private getInitialTheme(): boolean {
    if (typeof window === 'undefined') return false;

    const savedTheme = localStorage.getItem(this.THEME_KEY);
    if (savedTheme !== null) {
      return savedTheme === 'dark';
    }

    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  /**
   * Apply theme to document
   */
  private applyTheme(isDark: boolean): void {
    if (typeof document === 'undefined') return;

    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }

    // Save preference
    localStorage.setItem(this.THEME_KEY, isDark ? 'dark' : 'light');
  }

  /**
   * Toggle between dark and light mode
   */
  toggleTheme(): void {
    this.isDarkMode.set(!this.isDarkMode());
  }

  /**
   * Set specific theme
   */
  setTheme(isDark: boolean): void {
    this.isDarkMode.set(isDark);
  }
}
