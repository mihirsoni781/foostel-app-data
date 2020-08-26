import { Component, OnInit } from '@angular/core';
import{AuthService} from '../../auth.service';
import {Router} from '@angular/router';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  
  constructor(private auth_ : AuthService, private router: Router) {
    
   }

  ngOnInit(): void {
    this.auth_.getUser()
      .subscribe(res => {
      }, err => {
        if (err.status == 401) {
          console.log("Unauthorized request");
          this.router.navigate(['/signin'])
        }

      })
  }


  signOut() {
    localStorage.removeItem('token');
    this.router.navigate(['/signin']);
  }

}
