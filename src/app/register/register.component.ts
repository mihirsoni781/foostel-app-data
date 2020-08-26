import { Component, OnInit } from '@angular/core';
import {AuthService } from '../auth.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  turn=0
  UV_code=null
  regexp: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
  match(p){
    return this.regexp.test(p)
  }
  compare(p){
    if(p==this.user.password)
    {
      return 1;
    }
    return 0;
  }
  user={
    name:"",
    email:"",
    dc:"",
    phone:"",
    password:""
  }
  user_exist=false;
  next(){
    this.turn+=1;
  }
  previous(){
    if(this.turn>0)
      this.turn-=1;
  }
  verify(){
    this.auth.sendVerificationLink(this.user)
      .subscribe(
        res=>{
          this.next();
        }
        ,
        err=>console.log(err)
        )
  }
  checkMail(){
    this.user_exist = false;
    this.auth.checkMail(this.user.email)
      .subscribe(
        res=>{
          if(res.exist){
            this.user_exist=true;
          }
          else{
            this.next()
          }
        }
        ,
        err=>{
          console.log(err);
        }
        )
  }
  constructor(private auth: AuthService) { }

  ngOnInit(): void {
  }

}
