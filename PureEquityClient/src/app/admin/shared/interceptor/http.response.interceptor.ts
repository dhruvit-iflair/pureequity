import { Injectable } from '@angular/core';
import {
    HttpResponse,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { Router } from '@angular/router';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {

    constructor(public router: Router) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const started = Date.now();
        return next.handle(req).do((event: any) => {
            if (event instanceof HttpErrorResponse) {
                console.log(event.status);
            }
            // if (event instanceof HttpErrorResponse) {
            //     console.log(event.status);
            //     console.log(event.error);
            //     if (event.error.auth == false){
            //         localStorage.clear();
            //         this.router.navigate(['/login']);
            //     }
            // }
        }, (err: any) => {
            if (err instanceof HttpErrorResponse) {
                if (err.status === 401) {
                    if (err.error.auth == false) {
                        localStorage.clear();
                        this.router.navigate(['/login']);
                    }
                }
            }
        });
    }
}