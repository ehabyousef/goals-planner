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
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../core/services/auth';
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
    { name: 'Dashboard', url: '/', icon: 'lucideLayoutDashboard' },
    { name: 'Goals', url: '/goals', icon: 'lucideGoal' },
    // {  name: 'Tasks', url: '/tasks', icon: 'lucideCheckCheck' },
    { name: 'Calendar', url: '/calendar', icon: 'lucideCalendar' },
    { name: 'Settings', url: '/settings', icon: 'lucideSettings' },
  ];
  constructor(
    private _Auth: Auth,
    private _router: Router,
  ) {}
  logut() {
    this._Auth.logout();
    this._router.navigate(['/login']);
  }
}
