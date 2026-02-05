import { HlmPaginationImports } from './../../../../libs/ui/pagination/src/index';
import { Component, signal } from '@angular/core';
import { IGoal } from '../../core/interface/Types';
import { GoalService } from '../../core/services/goal-service';
import { Modal } from '../../components/modal/modal';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { DatePipe, NgClass } from '@angular/common';
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
    NgClass,
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
  allProducts: IGoal[] = [];
  constructor(private _GoalService: GoalService) {}
  goals = signal<IGoal[]>([]);
  ngOnInit(): void {
    this.AllGoals();
  }

  AllGoals() {
    this._GoalService.getAllGoals().subscribe({
      next: (res) => {
        this.goals.set(res.goals);
        console.log(res);
      },
    });
  }
}
