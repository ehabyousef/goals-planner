import { IGoal, ITask } from '../../core/interface/Types';

/** A single cell in the calendar grid */
export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  goals: IGoal[];
  tasks: ITask[];
}

/** Item displayed as a badge on a calendar day */
export interface CalendarItem {
  id: string;
  goalId: string;
  title: string;
  type: 'goal' | 'task';
  isCompleted: boolean;
}
