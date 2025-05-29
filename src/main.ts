import { bootstrapApplication } from '@angular/platform-browser';
import { RootComponent } from './root.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

bootstrapApplication(RootComponent, {
  providers: [provideRouter(routes)],
}).catch(err => console.error(err));
