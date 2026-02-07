import { IGoal, ITask } from '../../core/interface/Types';
import { GoalService } from '../../core/services/goal-service';
import { HlmBreadCrumbImports } from './../../../../libs/ui/breadcrumb/src/index';
import { HlmTooltipImports } from './../../../../libs/ui/tooltip/src/index';
import { Component, signal, viewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmProgressImports } from '@spartan-ng/helm/progress';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideShare2,
  lucidePencil,
  lucideCalendar,
  lucidePlus,
  lucideLock,
  lucideCheck,
  lucideCircle,
} from '@ng-icons/lucide';
import { Tasks } from '../../core/services/tasks.service';
import { EditGoalModal } from '../../components/edit-goal-modal/edit-goal-modal';
import { TaskModal } from '../../components/task-modal/task-modal';

@Component({
  selector: 'app-goal-details',
  imports: [
    HlmIcon,
    NgIcon,
    HlmBreadCrumbImports,
    HlmButtonImports,
    HlmCheckboxImports,
    HlmProgressImports,
    HlmCardImports,
    HlmSeparatorImports,
    HlmTooltipImports,
    EditGoalModal,
    DatePipe,
    TaskModal,
  ],
  providers: [
    provideIcons({
      lucideShare2,
      lucidePencil,
      lucideCalendar,
      lucidePlus,
      lucideLock,
      lucideCheck,
      lucideCircle,
    }),
  ],
  templateUrl: './goal-details.html',
  styleUrl: './goal-details.scss',
})
export class GoalDetails {
  constructor(
    private _GoalService: GoalService,
    private _TasksServices: Tasks,
    private _ActivatedRoute: ActivatedRoute,
  ) {}
  goal = signal<IGoal>({} as IGoal);
  doneTasks = signal<ITask[]>([]);
  progressTasks = signal<ITask[]>([]);
  comingTasks = signal<ITask[]>([]);
  selectedTask = signal<ITask | undefined>(undefined);
  editModal = viewChild<EditGoalModal>('editModal');
  addTask = viewChild<TaskModal>('addTask');
  editTaskModal = viewChild<TaskModal>('editTaskModal');

  openEditModal() {
    if (this.goal()?._id) {
      this.editModal()?.openDialog();
    }
  }

  onGoalUpdated(updatedGoal: IGoal) {
    this.goal.set(updatedGoal);
  }
  openAddTaskModal() {
    if (this.goal()?._id) {
      this.addTask()?.openDialog();
    }
  }
  openEditTaskModal(task: ITask) {
    this.selectedTask.set(task);
    setTimeout(() => {
      this.editTaskModal()?.openDialog();
    });
  }
  onTaskUpdated(updatedTask: ITask) {
    this.goalTasks();
    this.Goal(this.goal()._id);
  }
  ngOnInit(): void {
    this._ActivatedRoute.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.Goal(id);
      }
    });
  }

  Goal(id: string) {
    this._GoalService.singleGoal(id).subscribe({
      next: (res) => {
        this.goal.set(res.goal);
        this.goalTasks();
      },
    });
  }

  goalTasks(): void {
    this._TasksServices.getGoalTasks(this.goal()._id).subscribe({
      next: (res) => {
        if (res) {
          console.log(res.tasks);
          this.progressTasks.set(res.tasks.filter((task: ITask) => task.status === 'IN_PROGRESS'));
          this.doneTasks.set(res.tasks.filter((task: ITask) => task.status === 'DONE'));
          this.comingTasks.set(res.tasks.filter((task: ITask) => task.status === 'TODO'));
        }
      },
    });
  }
}
