import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus, lucideX } from '@ng-icons/lucide';
import { ThemeService } from '../../core/services/theme.service';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { BrnDialogImports } from '@spartan-ng/brain/dialog';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { GoalService } from '../../core/services/goal-service';
import { toast } from 'ngx-sonner';
import { ICategories } from '../../core/interface/Types';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgIcon,
    HlmButtonImports,
    HlmSeparatorImports,
    BrnDialogImports,
    HlmDialogImports,
    HlmLabelImports,
    HlmInputImports,
  ],
  providers: [provideIcons({ lucidePlus, lucideX })],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings {
  protected readonly themeService = inject(ThemeService);
  constructor(private _GoalService: GoalService) {}

  emailSummary = true;
  pushNotifications = true;
  motivationalQuotes = false;

  newCategoryName = '';

  // Color picker state for new category dialog
  selectedColor = signal('#22c55e');
  categories = signal<ICategories[]>([]);
  // Toggle methods
  toggleEmailSummary(): void {
    this.emailSummary = !this.emailSummary;
  }

  togglePushNotifications(): void {
    this.pushNotifications = !this.pushNotifications;
  }

  toggleMotivationalQuotes(): void {
    this.motivationalQuotes = !this.motivationalQuotes;
  }

  setTheme(theme: 'light' | 'dark'): void {
    this.themeService.setTheme(theme === 'dark');
  }

  onColorInput(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    if (!target) return;
    this.selectedColor.set(target.value);
  }
  ngOnInit() {
    this.allCateg();
  }
  onSubmit(dialogRef?: { close: () => void }) {
    const name = this.newCategoryName.trim();
    const color = this.selectedColor();

    if (!name) {
      toast.error('Category name is required');
      return;
    }

    const payload: ICategories = {
      Name: name,
      color,
    };

    this._GoalService.addCategory(payload).subscribe({
      next: () => {
        toast.success('Category added successfully');
        this.newCategoryName = '';
        dialogRef?.close?.();
        this.allCateg();
      },
      error: () => {
        toast.error('Failed to add category');
      },
    });
  }
  allCateg() {
    this._GoalService.allCategories().subscribe({
      next: (res) => {
        this.categories.set(res.categories);
      },
    });
  }

  deleteCateg(id: string | undefined) {
    this._GoalService.deleteCategory(id).subscribe({
      next: (res) => {
        toast.success('Category deleted successfully');
         this.allCateg();
      },
      error: () => {
        toast.error('cant delete category');
      },
    });
  }
}
