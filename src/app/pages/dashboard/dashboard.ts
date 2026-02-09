import { HlmProgressImports } from './../../../../libs/ui/progress/src/index';
import { HlmCardImports } from './../../../../libs/ui/card/src/index';
import { HlmSpinnerImports } from './../../../../libs/ui/spinner/src/index';
import { Component, signal, viewChild, computed, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideFlag,
  lucidePlus,
  lucideTrendingUp,
  lucideTarget,
  lucideSquareCheckBig,
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { RouterLink } from '@angular/router';
import { Modal } from '../../components/modal/modal';
import { BrnDialogImports } from '@spartan-ng/brain/dialog';
import { GoalService } from '../../core/services/goal-service';
import { IGoal, ITask } from '../../core/interface/Types';
import { DatePipe, NgClass } from '@angular/common';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { Tasks } from '../../core/services/tasks.service';
import { SearchService } from '../../core/services/search.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    HlmIcon,
    NgIcon,
    HlmProgressImports,
    HlmButtonImports,
    HlmSpinnerImports,
    RouterLink,
    Modal,
    BrnDialogImports,
    DatePipe,
    NgClass,
    HlmLabelImports,
    HlmCheckboxImports,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  providers: [
    provideIcons({
      lucidePlus,
      lucideFlag,
      lucideTrendingUp,
      lucideTarget,
      lucideSquareCheckBig,
    }),
  ],
})
export class Dashboard {
  private _GoalService = inject(GoalService);
  private _TasksServices = inject(Tasks);
  private _searchService = inject(SearchService);

  public value = 43;
  allGoals = signal<IGoal[]>([]);
  AllTasks = signal<ITask[]>([]);
  Tasks = signal<ITask[]>([]);
  isLoadingGoals = signal<boolean>(true);
  isLoadingTasks = signal<boolean>(true);
  modalComponent = viewChild<Modal>('modalComponent');

  // Filtered goals based on search query
  goals = computed(() => {
    const searchQuery = this._searchService.searchQuery();
    const all = this.allGoals();

    if (!searchQuery) {
      return all;
    }

    return all.filter(
      (goal) =>
        goal.title.toLowerCase().includes(searchQuery) ||
        goal.description?.toLowerCase().includes(searchQuery),
    );
  });

  ngOnInit() {
    this.getAllGoals();
    this.allTasks();
  }

  getAllGoals(): void {
    this.isLoadingGoals.set(true);
    this._GoalService.getAllGoals().subscribe({
      next: (res) => {
        if (res) {
          console.log(res.goals);
          this.allGoals.set(res.goals);
        }
        this.isLoadingGoals.set(false);
      },
      error: (err) => {
        this.isLoadingGoals.set(false);
        console.error(err);
      },
    });
  }

  allTasks(): void {
    this.isLoadingTasks.set(true);
    this._TasksServices.getAllTasks().subscribe({
      next: (res) => {
        if (res) {
          console.log(res.tasks);
          this.Tasks.set(res.tasks.filter((task: ITask) => task.status === 'IN_PROGRESS'));
          this.AllTasks.set(res.tasks);
        }
        this.isLoadingTasks.set(false);
      },
      error: (err) => {
        this.isLoadingTasks.set(false);
        console.error(err);
      },
    });
  }

  updateTask(id: string): void {
    this._TasksServices.updateTask(id, { status: 'DONE' }).subscribe({
      next: (res) => {
        console.log('Task updated successfully:', res);
        this.allTasks();
        // this.allGoals();
      },
      error: (error) => {
        console.error('Error updating task:', error);
      },
    });
  }
}
