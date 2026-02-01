import { HlmToasterImports } from '@spartan-ng/helm/sonner';
import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HlmToasterImports],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('goals-planner');
  private readonly themeService = inject(ThemeService); // Initialize theme service
}
