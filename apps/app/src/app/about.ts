import { Component } from '@angular/core';
import {
  CardComponent,
  CardHeaderComponent,
  CardTitleComponent,
  CardDescriptionComponent,
  CardContentComponent,
} from '@ojiepermana/angular/component/card';

@Component({
  selector: 'app-about',
  imports: [
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardContentComponent,
  ],
  template: `
    <section class="mx-auto max-w-3xl px-6 py-16">
      <h1 class="text-3xl font-bold tracking-tight">About</h1>
      <p class="mt-4 text-muted-foreground">
        A second route to show sidebar navigation working inside the
        <code class="rounded bg-muted px-1.5 py-0.5 text-sm text-foreground">LayoutWrapperDefault</code>
        shell from &#64;ojiepermana/angular.
      </p>

      <Card class="mt-8 block">
        <CardHeader>
          <h3 CardTitle>Layout wrapper</h3>
          <p CardDescription>One data-driven shell: brand, user, and nav items as inputs.</p>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-foreground">
            The wrapper assembles
            <code class="text-xs">Layout → LayoutNavigation → Navigation</code> for you, so the
            app only provides data. Try changing <code class="text-xs">nav-type</code> or
            <code class="text-xs">surface</code> in <code class="text-xs">app.html</code>.
          </p>
        </CardContent>
      </Card>
    </section>
  `,
})
export class About {}
