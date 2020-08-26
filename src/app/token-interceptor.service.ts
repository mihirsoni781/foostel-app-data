import { Injectable, Injector } from '@angular/core';
import{HttpInterceptor} from '@angular/common/http';
import {AuthService} from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{

  constructor(private injector: Injector) { }

  intercept(req,next){

    var auth = this.injector.get(AuthService);
    let tokenizedReq = req.clone({
      setHeaders:{
        Authorization: `Bearer ${auth.getToken()}`
      }
    })
    return next.handle(tokenizedReq);
  }
}
