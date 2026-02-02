import { HlmProgressImports } from './../../../../libs/ui/progress/src/index';
import { HlmCardImports } from './../../../../libs/ui/card/src/index';
import { Component } from '@angular/core';
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
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-dashboard',
  imports: [HlmIcon, NgIcon, HlmProgressImports, HlmButtonImports, RouterLink],
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
  public value = 43;
}
