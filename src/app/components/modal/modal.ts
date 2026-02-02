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
  title = input<string>('Edit profile');
  description = input<string>("Make changes to your profile here. Click save when you're done.");

  isOpen = signal<'open' | 'closed'>('closed');

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
    image: new FormControl(null),
    priority: new FormControl('LOW', [Validators.required]),
    status: new FormControl('ACTIVE', [Validators.required]),
    start_date: new FormControl(''),
    end_date: new FormControl(''),
  });

  openDialog() {
    this.isOpen.set('open');
  }

  ngOnInit() {
    this.allCateg();
  }

  onSubmit() {
    if (this.formData.valid) {
      const formValues = this.formData.getRawValue();

      const goalData: any = {
        category_id: formValues.category_id,
        title: formValues.title,
        description: formValues.description,
        priority: formValues.priority,
        status: formValues.status,
      };

      // Add optional fields if they exist
      if (formValues.start_date) {
        goalData.start_date = new Date(formValues.start_date);
      }
      if (formValues.end_date) {
        goalData.end_date = new Date(formValues.end_date);
      }
      if (formValues.image) {
        goalData.image = formValues.image;
      }

      this._GoalService.addGoal(goalData).subscribe({
        next: (res) => {
          console.log('Goal created successfully:', res);
          this.isOpen.set('closed');
          this.formData.reset({
            priority: 'LOW',
            status: 'ACTIVE',
          });
        },
        error: (error) => {
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
