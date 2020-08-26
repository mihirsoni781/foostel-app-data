import { Component, OnInit, ɵLocaleDataIndex } from '@angular/core';
import { MapserviceService } from 'src/app/mapservice.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FoostelservicesService } from 'src/app/foostelservices.service';
import { ResCountriesService } from 'src/app/res-countries.service';

@Component({
  selector: 'app-hostel',
  templateUrl: './hostel.component.html',
  styleUrls: ['./hostel.component.css']
})
export class HostelComponent implements OnInit {

  service_ = null;
  loading = true;
  loading2 = false;

  s = 0;
  constructor(public mapservice: MapserviceService, private activatedRoute: ActivatedRoute, private fs: FoostelservicesService, public router: Router, private cs: ResCountriesService) {

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      let serviceId = params['sid'];
      fs.getService(serviceId)
        .subscribe(res => {
          
          this.service_ = res;
          mapservice.initMap(this.service_.s_coords, 'map2');
          mapservice.addMarker(this.service_.s_coords);
          mapservice.setCenter(this.service_.s_coords);
          this.loading = false;
        }, err => {
          console.log(err)
        })
    });
  }

  ngOnInit(): void {

  }


}
