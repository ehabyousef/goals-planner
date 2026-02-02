import { HlmProgressImports } from './../../../../libs/ui/progress/src/index';
import { HlmCardImports } from './../../../../libs/ui/card/src/index';
import { Component, signal } from '@angular/core';
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
import { IGoal } from '../../core/interface/Types';
import { DatePipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [
    HlmIcon,
    NgIcon,
    HlmProgressImports,
    HlmButtonImports,
    RouterLink,
    Modal,
    BrnDialogImports,
    DatePipe,
    NgClass,
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
  constructor(private _GoalService: GoalService) {}
  public value = 43;
  goals = signal<IGoal[]>([]);

  ngOnInit() {
    this.allGoals();
  }
  allGoals(): void {
    this._GoalService.getAllGoals().subscribe({
      next: (res) => {
        if (res) {
          console.log(res.goals);
          this.goals.set(res.goals);
        }
      },
    });
  }
}
