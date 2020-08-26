import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import {AuthService} from '../auth.service';
import { version } from 'process';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  
  loading=null;
  verified=null;
  email="";
  password="";
  pass=null;
  nxt = '/user/profile';
  constructor(private auth: AuthService, private router: Router, private actr: ActivatedRoute) { }
  turn=0;
  ngOnInit(): void {
    this.actr.queryParams.subscribe((q)=>{
      if(q.nxt){
        this.nxt = q.nxt;
      }
    })
  }
  previous()
  {
    this.verified=null;
    this.pass=null;
  }
  checkEmail()
  {
    this.loading=true;
    this.auth.checkMail(this.email)
      .subscribe(res=>{ 
        this.verified=res.exist;
        this.loading = false;
      },err=>{
        console.log(err);
        document.write(err);
        this.loading = false;
      })
  }

  checkPassword(){
    this.loading=true;
    
    this.auth.checkPass(this.email,this.password)
    .subscribe(res=>{

      if(res.pass){
        localStorage.setItem('token',res.token);
        this.loading = false;
        this.router.navigate([this.nxt]);
      }else{
        this.loading = false;
        this.pass=false;
      }
    },err=>{
      console.log(err);
      this.loading =false;
    })
  }

}
