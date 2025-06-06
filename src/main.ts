import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes'; // Aquí importas 'routes'

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)]
});
