import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  public credentials :any;
  constructor() {}
  intercept(request: HttpRequest<any>, next: HttpHandler){
    this.credentials = JSON.parse(localStorage.getItem('token'));
    if (this.credentials && this.credentials.token) {
      request = request.clone({
        setHeaders: {
          Authorization: this.credentials.token
        }
      });
      return next.handle(request);  
    } else {
      return next.handle(request);
    }    
  }
}