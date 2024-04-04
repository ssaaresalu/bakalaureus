import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { SpinnerService } from './services/spinner.service';

@Injectable()
export class ApiRequestInterceptor implements HttpInterceptor {
  private readonly spinnerService = inject(SpinnerService);
  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    this.spinnerService.show();
    return next.handle(req).pipe(
      tap({
        next: (event: HttpEvent<unknown>) => {
          if (event instanceof HttpResponse) {
            this.spinnerService.hide();
          }
        },
        error: () => {
          this.spinnerService.hide();
        },
      }),
    );
  }
}
