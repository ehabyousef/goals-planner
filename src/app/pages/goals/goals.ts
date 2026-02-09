import { HlmSpinnerImports } from './../../../../libs/ui/spinner/src/index';
import { HlmPaginationImports } from './../../../../libs/ui/pagination/src/index';
import { Component, signal, viewChild, computed, inject } from '@angular/core';
import { ICategories, IGoal } from '../../core/interface/Types';
import { GoalService } from '../../core/services/goal-service';
import { Modal } from '../../components/modal/modal';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { DatePipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SearchService } from '../../core/services/search.service';
@Component({
  selector: 'app-goals',
  imports: [
    Modal,
    HlmIcon,
    NgIcon,
    DatePipe,
    NgClass,
    HlmPaginationImports,
    BrnSelectImports,
    HlmSelectImports,
    HlmButtonImports,
    HlmSpinnerImports,
    RouterLink,
  ],
  templateUrl: './goals.html',
  styleUrl: './goals.scss',
  providers: [
    provideIcons({
      lucidePlus,
    }),
  ],
})
export class Goals {
  private _GoalService = inject(GoalService);
  private _searchService = inject(SearchService);

  allGoalsData = signal<IGoal[]>([]);
  categories = signal<ICategories[]>([]);
  isLoading = signal<boolean>(true);
  modalComponent = viewChild<Modal>('modalComponent');

  // Filtered goals based on search query
  goals = computed(() => {
    const searchQuery = this._searchService.searchQuery();
    const all = this.allGoalsData();

    if (!searchQuery) {
      return all;
    }

    return all.filter(goal =>
      goal.title.toLowerCase().includes(searchQuery) ||
      goal.description?.toLowerCase().includes(searchQuery)
    );
  });

  // Pagination state
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);
  totalGoals = signal<number>(0);
  limit = 6;

  ngOnInit(): void {
    this.AllGoals();
    this.AllCategories();
  }

  AllGoals(page: number = 1) {
    this.isLoading.set(true);
    this._GoalService.getAllGoals(page, this.limit).subscribe({
      next: (res) => {
        this.allGoalsData.set(res.goals);
        this.currentPage.set(res.pagination.currentPage);
        this.totalPages.set(res.pagination.totalPages);
        this.totalGoals.set(res.pagination.totalGoals);
        this.isLoading.set(false);
        console.log(res);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error(err);
      },
    });
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.AllGoals(page);
    }
  }

  previousPage() {
    if (this.currentPage() > 1) {
      this.goToPage(this.currentPage() - 1);
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.goToPage(this.currentPage() + 1);
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const total = this.totalPages();
    const current = this.currentPage();

    // Show up to 5 page numbers centered around current page
    let start = Math.max(1, current - 2);
    let end = Math.min(total, start + 4);

    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
  AllCategories() {
    this._GoalService.allCategories().subscribe({
      next: (res) => {
        this.categories.set(res.categories);
        console.log(res);
      },
    });
  }

  onGoalCreated() {
    this.AllGoals(this.currentPage());
  }
}
