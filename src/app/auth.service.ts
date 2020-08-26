import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  prefix = ''
  userVerificationURL="/api/verifyUser";
  checkMailURL = "/api/checkmail";
  verifyPassURL = "/api/vp";
  constructor(private _http: HttpClient) { }
  signIn(user){
    return this._http.post("",user)
  }
  register() {
    
  }
  checkMail(email){
    return <any>this._http.post(this.prefix +this.checkMailURL,{email:email});
  }
  sendVerificationLink(user){
    return <any>this._http.post(this.prefix +this.userVerificationURL,{user: user});
  }
  checkPass(e,p){
    return <any>this._http.post(this.prefix +this.verifyPassURL,{email:e, password: p});
  }
  getToken()
  {
    return localStorage.getItem('token');
  }
  getUser(){
    return <any>this._http.get(this.prefix+"/api/getuser");
  }
  loggedIn(){
    return !!localStorage.getItem('token');
  }

}
