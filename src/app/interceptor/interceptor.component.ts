import { Component } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LogService } from '../log.service'

@Component({
  selector: 'app-interceptor',
  templateUrl: './interceptor.component.html',
  styleUrls: ['./interceptor.component.css']
})
export class InterceptorComponent implements HttpInterceptor {

  constructor(private auth: LogService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if(request.url.includes(`http://localhost:8080/citiesservice-server/services/rest/users/login`)){
      return next.handle(request);
    }

    if(request.url.includes(`http://localhost:8080/citiesservice-server/services/rest`)){
    request = request.clone({
      setHeaders: {
        'Authorization' : `${localStorage.getItem("Token")}`,
        'Content-Type' : `application/json`
      }
    });
    //console.log("Interceptor working");
    //console.log(request);
    }

    
    return next.handle(request);
  }

}
