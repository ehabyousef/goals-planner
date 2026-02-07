import { Component, input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { BrnDialogImports } from '@spartan-ng/brain/dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { GoalService } from '../../core/services/goal-service';
import { ICategories, IGoal } from '../../core/interface/Types';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { toast } from 'ngx-sonner';
@Component({
  selector: 'app-modal',
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
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
})
export class Modal {
  constructor(private _GoalService: GoalService) {}
  categories = signal<ICategories[]>([]);
  selectedFile: File | null = null;
  title = input<string>('Add New Goal');
  description = input<string>("Fill in the details below to add a new goal. Make sure to provide all the necessary information to create a comprehensive goal that you can track and achieve.");

  isOpen = signal<'open' | 'closed'>('closed');
  isSubmitting = signal(false);

  formData = new FormGroup({
    category_id: new FormControl('', [Validators.required]),
    title: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(100),
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(500),
    ]),
    priority: new FormControl('LOW', [Validators.required]),
    status: new FormControl('ACTIVE', [Validators.required]),
    start_date: new FormControl(''),
    end_date: new FormControl(''),
  });

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  openDialog() {
    this.isOpen.set('open');
  }

  ngOnInit() {
    this.allCateg();
  }

  onSubmit() {
    if (this.formData.valid) {
      this.isSubmitting.set(true);
      const formValues = this.formData.getRawValue();

      const formData = new FormData();
      formData.append('category_id', formValues.category_id!);
      formData.append('title', formValues.title!);
      formData.append('description', formValues.description!);
      formData.append('priority', formValues.priority!);
      formData.append('status', formValues.status!);

      // Add optional fields if they exist
      if (formValues.start_date) {
        formData.append('start_date', new Date(formValues.start_date).toISOString());
      }
      if (formValues.end_date) {
        formData.append('end_date', new Date(formValues.end_date).toISOString());
      }
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      this._GoalService.addGoal(formData).subscribe({
        next: (res) => {
          console.log('Goal created successfully:', res);
          this.isOpen.set('closed');
          this.formData.reset({
            priority: 'LOW',
            status: 'ACTIVE',
          });
          toast.success('Goal created successfully', {
            description: res.message || 'Your goal has been created.',
          });
          this.selectedFile = null;
          this.isSubmitting.set(false);
        },
        error: (error) => {
          this.isSubmitting.set(false);
          toast.error('Error creating goal', {
            description: error.message || 'An error occurred while creating the goal.',
          });
          console.error('Error creating goal:', error);
        },
      });
    }
  }

  allCateg(): void {
    this._GoalService.allCategories().subscribe({
      next: (res) => {
        if (res) {
          this.categories.set(res.categories);
          console.log(this.categories());
        }
      },
    });
  }
}
