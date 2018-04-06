import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const auth = this.injector.get(AuthService);
    request = request.clone({
        setParams:{
            "token": auth.getToken(),
            "user": auth.getUserId()
        }
    });
    /*request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${auth.getToken()}`
      }
    });*/
    //console.log(request.urlWithParams);
    return next.handle(request);
  }
}