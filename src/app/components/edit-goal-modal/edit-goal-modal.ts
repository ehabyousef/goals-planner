import { Component, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrnDialogImports } from '@spartan-ng/brain/dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { GoalService } from '../../core/services/goal-service';
import { IGoal } from '../../core/interface/Types';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-edit-goal-modal',
  imports: [
    BrnDialogImports,
    HlmDialogImports,
    HlmLabelImports,
    HlmInputImports,
    HlmButtonImports,
    ReactiveFormsModule,
    BrnSelectImports,
    HlmSelectImports,
  ],
  templateUrl: './edit-goal-modal.html',
})
export class EditGoalModal {
  constructor(private _GoalService: GoalService) {}

  goalData = input.required<IGoal>();
  goalUpdated = output<IGoal>();

  isOpen = signal<'open' | 'closed'>('closed');
  isSubmitting = signal(false);
  selectedFile: File | null = null;

  formData = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    priority: new FormControl(''),
    status: new FormControl(''),
    end_date: new FormControl(''),
  });

  openDialog() {
    const goal = this.goalData();
    this.formData.patchValue({
      title: goal.title || '',
      description: goal.description || '',
      priority: goal.priority || '',
      status: goal.status || '',
      end_date: goal.end_date ? this.formatDateForInput(goal.end_date) : '',
    });
    this.isOpen.set('open');
  }

  private formatDateForInput(dateValue: Date | string): string {
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    return date.toISOString().split('T')[0];
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit() {
    this.isSubmitting.set(true);
    const formValues = this.formData.getRawValue();
    const goal = this.goalData();

    if (!goal?._id) {
      this.isSubmitting.set(false);
      toast.error('Error updating goal', {
        description: 'Goal ID is missing.',
      });
      return;
    }

    const formData = new FormData();

    if (formValues.title?.trim()) formData.append('title', formValues.title);
    if (formValues.description?.trim()) formData.append('description', formValues.description);
    if (formValues.priority) formData.append('priority', formValues.priority);
    if (formValues.status) formData.append('status', formValues.status);
    if (formValues.end_date) formData.append('end_date', new Date(formValues.end_date).toISOString());
    if (this.selectedFile) formData.append('image', this.selectedFile);

    this._GoalService.updateGoal(goal._id, formData).subscribe({
      next: (res) => {
        this.isOpen.set('closed');
        toast.success('Goal updated successfully', {
            description: res.message || 'Your goal has been updated.',
          });
        this.selectedFile = null;
        this.isSubmitting.set(false);
        this.goalUpdated.emit(res.goal);
      },
      error: (error) => {
        this.isSubmitting.set(false);
        toast.error('Error updating goal', { description: error.message });
      },
    });
  }
}
