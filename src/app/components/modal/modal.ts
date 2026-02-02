import { Component, input, signal } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { BrnDialogImports } from '@spartan-ng/brain/dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';

@Component({
  selector: 'app-modal',
  imports: [
    BrnDialogImports,
    HlmDialogImports,
    HlmLabelImports,
    HlmInputImports,
    HlmButtonImports,
    // NgIcon,
  ],
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
})
export class Modal {
  title = input<string>('Edit profile');
  description = input<string>("Make changes to your profile here. Click save when you're done.");

  isOpen = signal<'open' | 'closed'>('closed');

  openDialog() {
    this.isOpen.set('open');
  }
}
