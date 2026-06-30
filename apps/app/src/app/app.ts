import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  LayoutWrapperDefault,
  type BrandIdentity,
  type UserIdentity,
} from '@ojiepermana/angular/theme/layout/wrapper';
import { LayoutService } from '@ojiepermana/angular/theme/layout/services';
import type { NavigationItem } from '@ojiepermana/angular/navigation';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LayoutWrapperDefault],
  templateUrl: './app.html',
})
export class App {
  /**
   * Layout defaults (surface / appearance / type / width). `registerDefaults`
   * seeds the service — a persisted user choice still wins — and returns the
   * service itself; the template binds the wrapper to these signals so the
   * registered defaults take effect (the wrapper's own inputs would otherwise
   * override them).
   */
  protected readonly layout = inject(LayoutService).registerDefaults({
    surface: 'grid-line',
    appearance: 'border-rail',
    type: 'vertical',
    width: 'container',
  });

  /** Brand shown in the layout's sidebar header. */
  protected readonly brand: BrandIdentity = {
    name: 'Bungkit',
    icon: 'deployed_code',
    title: 'Bungkit',
    subtitle: 'Angular SPA',
  };

  /** User identity shown in the layout's sidebar footer. */
  protected readonly user: UserIdentity = {
    name: 'Ojie Permana',
    email: 'me@ojiepermana.com',
  };

  /**
   * Sidebar navigation. In-app routes use `link` (Angular Router, resolved
   * against the `/app/` baseHref); the marketing site is an `externalLink`.
   */
  protected readonly nav: readonly NavigationItem[] = [
    { id: 'dashboard', type: 'item', title: 'Dashboard', icon: 'dashboard', link: '/', exactMatch: true },
    { id: 'about', type: 'item', title: 'About', icon: 'info', link: '/about' },
    { type: 'divider' },
    { id: 'site', type: 'item', title: 'Marketing site', icon: 'public', href: '/', externalLink: true },
  ];
}
