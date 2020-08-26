import { Component, OnInit } from '@angular/core';
import {FoostelservicesService} from '../../../foostelservices.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-user-services',
  templateUrl: './user-services.component.html',
  styleUrls: ['./user-services.component.css']
})
export class UserServicesComponent implements OnInit {
  ss=null;
  loading=true;
  myServices=[];
  constructor(private fs : FoostelservicesService, public router: Router) {
    
   }

  ngOnInit(): void {
    this.fs.getUserServices()
      .subscribe(res => {
        this.myServices = res;
        this.loading = false;
      }, err => {
        console.log(err);
      })
  }
  viewd(s_index){
    let service = this.myServices[s_index];
    console.log(service);
    if(service.s_type=='Room')
    {
      this.router.navigate(['user/room-details'], { queryParams: {sid:service._id}})
    }
    if(service.s_type=="Hostel")
    {
      this.router.navigate(['user/hostel-details'], { queryParams: { sid: service._id } })
    }
    if(service.s_type=="Food Center")
    {
      this.router.navigate(['user/food-center-details'], { queryParams: { sid: service._id } })
    }
  }

}
