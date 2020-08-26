import { Component, OnInit, ɵLocaleDataIndex, ɵɵNgOnChangesFeature } from '@angular/core';
import { MapserviceService } from 'src/app/mapservice.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FoostelservicesService } from 'src/app/foostelservices.service';
import { ResCountriesService } from '../../../../res-countries.service';
import { HttpClient } from '@angular/common/http';
import { Observable, observable } from 'rxjs';
@Component({
  selector: 'app-room-details',
  templateUrl: './room-details.component.html',
  styleUrls: ['./room-details.component.css']
})
export class RoomDetailsComponent implements OnInit {

  service_ = null;
  loading = true;
  loading2 = false;
  uploadStatus;
  s = 0;
  constructor(private http: HttpClient, public mapservice: MapserviceService, private activatedRoute: ActivatedRoute,
    private fs: FoostelservicesService, public router: Router, private cs: ResCountriesService) {
      this.uploadStatus = fs;
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      let serviceId = params['sid'];
      //console.log(serviceId);
      fs.getUserService(serviceId)
        .subscribe(res => {
          this.service_ = res;
          //console.log(this.service_);
          mapservice.initMap();
          //console.log(this.service_.s_coords);
          mapservice.addMarker(this.service_.s_coords);
          mapservice.setCenter(this.service_.s_coords);
          this.loading = false;
          mapservice.enableMarkerAdd();
        }, err => {
          console.log(err)
        })
    });
  }

  ngOnInit(): void {

    

  }
  setDefaultLoc() {
    this.mapservice.updateMarker(this.service_.s_coords);
    this.mapservice.map._userCoors = null;
  }
  s_loc_tmp = null;
  c_loc = null;
  loading3 = null;
  saveLoc() {
    this.loading3 = true;
    this.s_loc_tmp = this.mapservice.map._userCoors;
    //console.log(this.s_loc_tmp);
    this.mapservice.reverseGeoCode(this.s_loc_tmp)
      .subscribe(res => {
        this.service_.s_loc = res.features;
        this.service_.s_coords = this.s_loc_tmp;
        let cc = res.features[res.features.length - 1].properties.short_code;
        this.cs.getCurrency(cc)
          .subscribe(res => {
            //console.log(res);
            this.service_.s_currency = res.currencies[0].code;
            this.service_.s_currency_symbol = res.currencies[0].symbol;
            this.loading3 = false;
            this.mapservice.map._userCoors = null;
          },
            err => {
              console.log(err);
              this.loading3 = false;
            })
      }, err => {
        console.log(err);
      })
  }

  

  update() {

    if (!this.loading3) {
      this.loading2 = true;
      //console.log("WAITOVER");
      this.fs.updateService(this.service_)
        .subscribe(res => {
          this.service_ = res;
          if(this.imgsToDelete.length)
          {
            this.delete();
          }
          if(this.filesToUpload.length)
          {
            this.upload();
          }
          else{
            this.router.navigate(['user/services'])
            this.loading2 = false;
            //console.log("DATA UPDATED");
          }
        }, err => {
          console.log(err)
        })
    }
  }
  img = null;

  upload() {
    //console.log(this.fs.uploadImage(this.filesToUpload,0,this.service_._id));

    var obs = Observable.create((observer)=>{
      this.fs.uploadImage(this.filesToUpload, 0, this.service_._id,observer)
    })

    obs.subscribe(null,null,()=>{
      //console.log("completed !!!");
      this.router.navigate(['user/services']);
    })

  }

  filesToUpload = [];
  curImages=[];

  preview(e){
    
    var view = function(files,i)
    {
      //console.log("FILESI");
      //console.log(i);
      var freader = new FileReader();
      this.filesToUpload.push(files[i]);
      freader.readAsDataURL(files[i]);
      freader.onload = function (result) {
        //console.log("RESULT IMAGE");
        this.curImages.push(freader.result);
        //console.log(this.curImages);
        if(i<files.length-1)
        {
          view(files,i+1);
        }

      }.bind(this)
    }.bind(this)

    view(e.target.files,0);

  }
  remove(i){  
    this.curImages.splice(i,1);
    this.filesToUpload.splice(i,1);
  }
  
  imgsToDelete = [];

  selectToDelete(i){
    this.imgsToDelete.push(this.service_.photos[i]);
    this.service_.photos.splice(i,1);
  }

  delete(){
    this.fs.deleteImage(this.imgsToDelete[0].imageId, this.service_._id)
      .subscribe(res => {
        //console.log(res);
        if (res.dltd) {
          this.imgsToDelete.splice(0,1);
          if(this.imgsToDelete.length)
            this.delete()
        }
      }, err => {
        console.log(err);

      })
  }

}
