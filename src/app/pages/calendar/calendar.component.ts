import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';

import { GoalService } from '../../core/services/goal-service';
import { Tasks as TasksService } from '../../core/services/tasks.service';
import { IGoal, ITask } from '../../core/interface/Types';
import { CalendarDay, CalendarItem } from './calendar.model';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  /** Current month anchor date */
  currentDate = signal<Date>(new Date());

  private goals = signal<IGoal[]>([]);
  private tasks = signal<ITask[]>([]);
  loading = signal<boolean>(true);
  readonly weekDays = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  /** Formatted month/year title, e.g. "February 2026" */
  monthTitle = computed(() => format(this.currentDate(), 'MMMM yyyy'));

  /**
   * Generate the 32-cell calendar grid for the current month.
   * Each cell contains its date, flags, and matching goals/tasks.
   */
  calendarDays = computed<CalendarDay[]>(() => {
    const current = this.currentDate();
    const monthStart = startOfMonth(current);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 6 }); // Saturday
    // const monthEnd = endOfMonth(current);
    // const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 6 });

    const days: CalendarDay[] = [];
    let day = calendarStart;

    // Build exactly 32 cells (5 weeks)
    while (days.length < 32) {
      days.push({
        date: day,
        isCurrentMonth: isSameMonth(day, current),
        isToday: isToday(day),
        goals: this.getGoalsForDay(day),
        tasks: this.getTasksForDay(day),
      });
      day = addDays(day, 1);
    }
    console.log(days);
    return days;
  });

  constructor(
    private goalService: GoalService,
    private tasksService: TasksService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ──────────────────────────────────────────────
  // Data Loading
  // ──────────────────────────────────────────────

  /** Fetch all goals and tasks in parallel */
  private loadData(): void {
    this.loading.set(true);

    forkJoin({
      goalsRes: this.goalService.getAllGoals(1, 100),
      tasksRes: this.tasksService.getAllTasks(),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ goalsRes, tasksRes }) => {
          this.goals.set(goalsRes.goals ?? []);
          this.tasks.set(tasksRes.tasks ?? []);
          this.loading.set(false);
        },
        error: () => {
          this.goals.set([]);
          this.tasks.set([]);
          this.loading.set(false);
        },
      });
  }

  // ──────────────────────────────────────────────
  // Day-level helpers
  // ──────────────────────────────────────────────

  private getGoalsForDay(day: Date): IGoal[] {
    return this.goals().filter((goal) => {
      if (!goal.end_date) return false;
      return isSameDay(new Date(goal.end_date), day);
    });
  }

  private getTasksForDay(day: Date): ITask[] {
    return this.tasks().filter((task) => {
      if (!task.end_date) return false;
      return isSameDay(new Date(task.end_date), day);
    });
  }

  getItemsForDay(day: CalendarDay): CalendarItem[] {
    const items: CalendarItem[] = [];

    for (const goal of day.goals) {
      items.push({
        id: goal._id,
        goalId: goal._id,
        title: goal.title,
        type: 'goal',
        isCompleted: goal.status === 'COMPLETED',
      });
    }

    for (const task of day.tasks) {
      items.push({
        id: task._id ?? '',
        goalId: task.goal_id,
        title: task.title,
        type: 'task',
        isCompleted: task.status === 'DONE',
      });
    }

    return items;
  }

  /** Return only the first 2 visible items */
  getVisibleItems(day: CalendarDay): CalendarItem[] {
    return this.getItemsForDay(day).slice(0, 2);
  }

  /** Count of hidden overflow items beyond the first 2 */
  getOverflowCount(day: CalendarDay): number {
    const total = this.getItemsForDay(day).length;
    return total > 2 ? total - 2 : 0;
  }

  // ──────────────────────────────────────────────
  // Navigation
  // ──────────────────────────────────────────────

  previousMonth(): void {
    this.currentDate.set(subMonths(this.currentDate(), 1));
  }

  nextMonth(): void {
    this.currentDate.set(addMonths(this.currentDate(), 1));
  }

  goToToday(): void {
    this.currentDate.set(new Date());
  }

  navigateToGoal(item: CalendarItem): void {
    this.router.navigate(['/goals', item.goalId]);
  }

  /** CSS classes for the item badge based on type + completion */
  getBadgeClasses(item: CalendarItem): string {
    if (item.isCompleted) {
      // Green for completed
      return 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/30';
    }
    if (item.type === 'goal') {
      // Purple for goal deadlines
      return 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-500/30';
    }
    // Blue for pending tasks
    return 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-500/30';
  }

  getBadgeIcon(item: CalendarItem): string {
    return item.isCompleted ? '✓' : '•';
  }
}
