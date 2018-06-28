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
    if (request.method === "DELETE") {
      console.log("Filtered the DELETE");
      return next.handle(request);
    }
    if (request.url.includes(`http://localhost:8080/citiesservice-server/services/rest/users/login`)) {
      return next.handle(request);
    }

    if (request.url.includes(`http://localhost:8080/citiesservice-server/services/rest`)) {
      request = request.clone({
        setHeaders: {
          'Authorization': `${localStorage.getItem("Token")}`,
          'Content-Type': `application/json`
        }
      });
    }


    return next.handle(request);
  }

}
/**This component intercepts every outgoing http requests and filters them to perform changes. The most important, adding the current token. */