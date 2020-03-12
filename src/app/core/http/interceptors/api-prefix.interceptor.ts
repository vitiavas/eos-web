import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { map } from "rxjs/operators";

// @Injectable()
// export class ApiPrefixInterceptor implements HttpInterceptor {
    
//     // intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     //     if (request.url.match("/i18n")) {
//     //         let local = environment.local;
//     //         request = request.clone({ url: local + request.url });
//     //         return next.handle(request);
//     //     }
//     //     if (request.url.includes("http")) {
//     //         request = request.clone({ url: request.url });
//     //     } else {
//     //         let serverUrl = environment.tosUrl;
//     //         request = request.clone({ url: serverUrl + request.url });
//     //     }
//     //     return next.handle(request);
//     // }   
// }

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    token$: string;
    // constructor(private http:HttpClient){
    //     this.token$ = return this.http.post('https://jul-dev.ptecports.com/gad-services/api/authenticate', {username: "admin", password:123})
    //     .pipe(map(res =>  res['token']))
    // }
    
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // const token: string = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE1NjIyNDI0MjgsImp0aSI6IjA1NWZiNjcwLWExOGYtNGI0ZS05NWVmLWJjZDkxMTQ0MTM2YSIsImlzcyI6Imh0dHBzOi8vanVsLWRldi5wdGVjcG9ydHMuY29tIiwiYXVkIjoiQVBQIiwiZXhwIjoxNTYyMzQyNDI4LCJzdWIiOiJkLmFsbWFkYUBibGFuZHlzaGlwcGluZy5jb20iLCJvcmciOiI4ZTFmMmEyMS1hY2NjLTQxNjMtODU2ZC0zZTIyYjIwYWVhOWIifQ.in-yUDhH5j0DPTVfCwbFPBeocrHDqezm2qTNHhkEL9iDsVf09ZE44RIxbwfUyu5_Hr25P26U1ieh0CEHcmWMvxlhdEXWhDPSPD7UAYWE1iqaEDRxv4JAplhyqnQbY7greqIUFqUSNyzDzKTUC9P8sGXPLTQa0EToSA_XRRh4TCEaAKm-54kyMAEcrBGenAVuYF_-pD6CUzJn635CwVfpQPhSymroTumX8uA-i1bAOl9i1G4S0G2jO3GiXC7kyxb-eUxYgDJN9ZRa_pJbDaSMkjjbue9O_lzz4Ixj7BkbVfHnMdkHPpQHyGT9LQqkAxWzapcxmjJ1egsqLWOCPEAqxQ";
    
            // request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
        

        if (!request.headers.has('Content-Type')) {
            request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        }

        request = request.clone({ headers: request.headers.set('Accept', 'application/json') });

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    console.log('event--->>>', event);
                }
                return event;
            }));
     }
 }