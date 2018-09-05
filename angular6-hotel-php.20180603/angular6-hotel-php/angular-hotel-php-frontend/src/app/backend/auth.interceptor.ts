import {Injectable} from "@angular/core";
import {HttpInterceptor, HttpHandler, HttpRequest, HttpEvent} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let storedUser = localStorage.getItem("user");
    if (storedUser) {
      let user = JSON.parse(storedUser);
      if (user) {
        const authReq = req.clone({headers: req.headers.set('X-Auth-Token', user.token)});
        return next.handle(authReq);
      }
    }
    return next.handle(req);
  }
}
