import { Component, OnInit } from '@angular/core';
import { MapserviceService } from 'src/app/mapservice.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FoostelservicesService } from 'src/app/foostelservices.service';
@Component({
  selector: 'app-service-details',
  templateUrl: './service-details.component.html',
  styleUrls: ['./service-details.component.css']
})
export class ServiceDetailsComponent implements OnInit {
  service_=null;
  loading=true;
  loading2=false;
  
  s=0;
  constructor(public mapservice: MapserviceService, private activatedRoute: ActivatedRoute, private fs: FoostelservicesService, public router : Router) {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      let serviceId=params['sid'];
      console.log(serviceId);
      fs.getUserService(serviceId)
        .subscribe(res=>{
          this.service_ = res;
          console.log(this.service_);
          mapservice.initMap();
          console.log(this.service_.s_coords);
          mapservice.addMarker(this.service_.s_coords);
          mapservice.setCenter(this.service_.s_coords);
          this.loading=false;
          
        },err=>{
          console.log(err)
        })
    });
   }

  ngOnInit(): void {

    
  }

  update()
  {
    this.loading2=true;
    this.fs.updateService(this.service_)
      .subscribe(res=>{
        console.log(res);
        this.service_=res;
        this.loading2=false;
        this.router.navigate(['user/services'])
      },err=>{
        console.log(err)
      })
  }
}
