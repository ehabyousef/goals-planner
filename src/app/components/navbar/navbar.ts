import { Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBell,
  lucideMessageSquare,
  lucideSearch,
  lucideSunMoon,
  lucideThermometerSun,
} from '@ng-icons/lucide';
import { HlmAvatarImports } from '../../../../libs/ui/avatar/src';
import { HlmButtonImports } from '../../../../libs/ui/button/src';
import { HlmInputImports } from '../../../../libs/ui/input/src';
import { ThemeService } from '../../core/services/theme.service';
import { SearchService } from '../../core/services/search.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  imports: [NgIcon, HlmInputImports, HlmButtonImports, HlmAvatarImports, FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  host: {
    class: 'flex items-center justify-between flex-1',
  },
  providers: [
    provideIcons({
      lucideSearch,
      lucideBell,
      lucideSunMoon,
      // luicd
    }),
  ],
})
export class Navbar {
  protected readonly themeService = inject(ThemeService);
  protected readonly searchService = inject(SearchService);

  searchQuery = '';

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  onSearchChange(value: string): void {
    this.searchService.setSearchQuery(value);
  }
}
