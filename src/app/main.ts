import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { routes } from './app.routes'; // Aquí importas 'routes'

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)]
});
