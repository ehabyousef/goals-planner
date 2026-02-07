import { Component, input, Input, signal, Output, EventEmitter } from '@angular/core';
import { Tasks } from '../../core/services/tasks.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { toast } from 'ngx-sonner';
import { ITask } from '../../core/interface/Types';
import { BrnDialogImports } from '@spartan-ng/brain/dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@spartan-ng/helm/select';
@Component({
  selector: 'app-task-modal',
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
  templateUrl: './task-modal.html',
  styleUrl: './task-modal.scss',
})
export class TaskModal {
  constructor(private _TaskService: Tasks) {}
  isOpen = signal<'open' | 'closed'>('closed');

  @Input() title = 'Add New Task';
  @Input() description =
    'Fill in the details below to add a new task. Make sure to provide all the necessary information to create a comprehensive task that you can track and achieve.';
  @Input() taskData?: ITask;
  @Output() taskUpdated = new EventEmitter<ITask>();
  @Input() goalId?: string;

  isSubmitting = signal(false);
  isUpdateMode = signal(false);

  formData = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    priority: new FormControl(''),
    status: new FormControl(''),
    start_date: new FormControl(''),
    end_date: new FormControl(''),
    goal_id: new FormControl(''),
  });

  // ngOnInit() {
  //   if (!this.taskData && this.goalId) {
  //     this.formData.patchValue({ goal_id: this.goalId });
  //   }
  // }

  openDialog() {
    // Populate form based on mode every time dialog opens
    if (this.taskData) {
      this.isUpdateMode.set(true);
      this.formData.patchValue({
        title: this.taskData.title,
        description: this.taskData.description,
        priority: this.taskData.priority,
        status: this.taskData.status,
        end_date: this.taskData.end_date
          ? new Date(this.taskData.end_date).toISOString().split('T')[0]
          : '',
      });
    } else {
      this.isUpdateMode.set(false);
      if (this.goalId) {
        this.formData.patchValue({ goal_id: this.goalId });
      }
    }
    this.isOpen.set('open');
  }

  onSubmit() {
    if (this.formData.valid) {
      this.isSubmitting.set(true);
      const formValues = this.formData.getRawValue();

      if (this.isUpdateMode()) {
        // Update mode - exclude start_date and goal_id
        const updateData: any = {
          title: formValues.title,
          description: formValues.description,
          priority: formValues.priority,
          status: formValues.status,
          end_date: formValues.end_date,
        };

        this._TaskService.updateTask(this.taskData?._id!, updateData).subscribe({
          next: (res) => {
            this.isOpen.set('closed');
            toast.success('Task updated successfully', {
              description: res.message || 'Your task has been updated.',
            });
            this.taskUpdated.emit(res.task);
            this.isSubmitting.set(false);
          },
          error: (error) => {
            this.isSubmitting.set(false);
            toast.error('Error updating task', {
              description: error.message || 'An error occurred while updating the task.',
            });
          },
        });
      } else {
        // Create mode
        this._TaskService.addTask(formValues as any).subscribe({
          next: (res) => {
            this.isOpen.set('closed');
            this.formData.reset({
              priority: 'LOW',
              status: 'TODO',
              goal_id: this.goalId || '',
            });
            toast.success('Task created successfully', {
              description: res.message || 'Your task has been created.',
            });
            this.taskUpdated.emit(res.task);
            this.isSubmitting.set(false);
          },
          error: (error) => {
            this.isSubmitting.set(false);
            toast.error('Error creating task', {
              description: error.message || 'An error occurred while creating the task.',
            });
          },
        });
      }
    }
  }
}
