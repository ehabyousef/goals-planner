import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCalendar,
  lucideCheckCheck,
  lucideGoal,
  lucideLayoutDashboard,
  lucideLogOut,
  lucideSettings,
} from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSidebarImports } from '../../../../libs/ui/sidebar/src';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [HlmSidebarImports, HlmSidebarImports, HlmIcon, NgIcon, RouterLink],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideIcons({
      lucideLayoutDashboard,
      lucideGoal,
      lucideCalendar,
      lucideCheckCheck,
      lucideSettings,
      lucideLogOut,
    }),
  ],
})
export class SideBar {
  protected readonly _projects = [
    { info: 24, name: 'Dashboard', url: '/', icon: 'lucideLayoutDashboard' },
    { info: 3, name: 'Goals', url: '/goals', icon: 'lucideGoal' },
    { info: 21, name: 'Tasks', url: '/tasks', icon: 'lucideCheckCheck' },
    { info: 8, name: 'calender', url: '/', icon: 'lucideCalendar' },
    { info: 8, name: 'settings', url: '/', icon: 'lucideSettings' },
  ];
}
