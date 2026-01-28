import { Component } from '@angular/core';
import { IGoal } from '../../core/interface/Types';
import { GoalService } from '../../core/services/goal-service';

@Component({
  selector: 'app-goals',
  imports: [],
  templateUrl: './goals.html',
  styleUrl: './goals.scss',
})
export class Goals {
  allProducts: IGoal[] = [];
  constructor(private _GoalService: GoalService) {}
  ngOnInit(): void {
    this.AllGoals();
  }

  AllGoals() {
    this._GoalService.getAllGoals().subscribe((next) => {
      console.log(next);
    });
  }
}
