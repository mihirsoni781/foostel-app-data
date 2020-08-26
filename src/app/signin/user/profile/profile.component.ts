import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../../auth.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  loading=true;
  user = {
    name: "",
    phone: "",
    email: ""
  }
  fileUrl;
  inputFile :File;
  view(event){
    
    let reader =  new FileReader();
    this.inputFile = event.target.files[0];
    reader.readAsDataURL(this.inputFile);
    reader.onload = (e)=>{
      this.fileUrl = reader.result;
      
      
    }
  }
  constructor(private router: Router, public auth_: AuthService) { }

  ngOnInit(): void {
    this.auth_.getUser()
      .subscribe(res => {
        
        
        this.user = res;
        this.loading=false;
      }, err => {
        if (err.status == 401) {
          
          this.router.navigate(['/signin'])
        }

      })
  }

  signOut() {
    localStorage.removeItem('token');
    this.router.navigate(['/signin']);
  }

}
