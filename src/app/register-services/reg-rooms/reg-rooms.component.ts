import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import {NgForm} from '@angular/forms';
import {MapserviceService} from '../../mapservice.service';
import{Service} from '../../../../server/models/service';
import { ResCountriesService } from '../../../app/res-countries.service';
import {FoostelservicesService} from '../../foostelservices.service';
import { AuthService } from 'src/app/auth.service';
@Component({
  selector: 'app-reg-rooms',
  templateUrl: './reg-rooms.component.html',
  styleUrls: ['./reg-rooms.component.css']
})
export class RegRoomsComponent implements OnInit {
  service = null;
  loading_status=false;
  room={
    for:{
      gender:"",
      type:""
    },
    room_types:{
      _1_room:{
        isset:0,
        available:1,
        rent:"",
        cm: ""
      },
      _2_room: {
        isset: 0,
        available: 1,
        rent: "",
        cm: ""
      },
      with_kichen_room: {
        isset: 0,
        available: 1,
        rent: "",
        cm: ""
      },
      other_room: {
        isset: 0,
        desc:String,
        available: 1,
        rent: "",
        cm: ""
      }
    },
    facilities:{
      parking:0,
      attached_bath: 0,
      housekeeping: 0,
      bed: 0,
      ac: 0,
      other:""
    }
  }

  turn=0;
  constructor( private auth_: AuthService,public mapservice: MapserviceService, private cs: ResCountriesService, private fs: FoostelservicesService, private router : Router) {
    this.service = new Service('Room');

  }  
  ngOnInit(): void {
    this.auth_.getUser()
      .subscribe(res => {
      }, err => {
        if (err.status == 401) {
          console.log("Unauthorized request");
          this.router.navigate(['/signin'], { queryParams: { nxt: this.router.url } })
        }

      })
    this.mapservice.initMap()
    this.mapservice.enableMarkerAdd()
  }
  next()
  {
    this.turn+=1;
  }
  previous(){
    if(this.turn>0)
      this.turn-=1
  }

  add(){
    this.loading_status=true;
    this.service.s_coords=this.mapservice.map._userCoors;
    this.mapservice.reverseGeoCode(this.service.s_coords)
      .subscribe(res=>{
        
        this.service.s_loc = res.features;
        this.loading_status=false;
        let cc = res.features[res.features.length - 1].properties.short_code;
        this.cs.getCurrency(cc).subscribe(
          res => {
            this.service.s_currency = res.currencies[0].code;
            this.service.s_currency_symbol = res.currencies[0].symbol;
          }
          , err => {
            console.log(err)
          })
        this.next();
      },
      err=>
      {this.loading_status=false;
        console.log(err)
      })
      
  }
  insert(){
    this.loading_status=true;
    this.service.s_data = this.room;
    
    this.fs.insertService(this.service)
      .subscribe(res=>{
        this.loading_status=false;
        this.next()
      },err=>{
        console.log(err);
      })
  }

  view(){
    this.router.navigate(['../../user/services']);    
  }


  automate(){
    for(let i=0; i<5; i++){
    let room = {
      for: {
        gender: "female",
        type: "employee"
      },
      room_types: {
        _1_room: {
          isset: 1,
          available: 1,
          rent: "4000",
          cm: "2000"
        },
        _2_room: {
          isset: 1,
          available: 2,
          rent: "45210",
          cm: "2000"
        },
        with_kichen_room: {
          isset: 0,
          available: 1,
          rent: "",
          cm: ""
        },
        other_room: {
          isset: 0,
          desc: String,
          available: 1,
          rent: "",
          cm: ""
        }
      },
      facilities: {
        parking: 1,
        attached_bath: 0,
        housekeeping: 1,
        bed: 0,
        ac: 0,
        other: ""
      }
      
    }
    
    function getRandomInt(min, max,i) {
      return min+((max-min)*Math.random()) 
    }

    let serv = new Service('Room');

      serv.s_coords = { lng: getRandomInt(75.81605874212914, 75.92934313778699, i), lat: getRandomInt(22.671799937758905, 22.76897232233084,i)};
    serv.s_name = "room test"+i;
    serv.owner_contact = '1234567890';
    serv.dc = '91';
    serv.s_data = room;
      this.loading_status = true;
      //serv.s_coords=this.mapservice.map._userCoors;
      this.mapservice.reverseGeoCode(serv.s_coords)
        .subscribe(res => {
          serv.s_loc = res.features;
          this.loading_status = false;
          let cc = res.features[res.features.length - 1].properties.short_code;
          this.cs.getCurrency(cc).subscribe(
            res => {
              serv.s_currency = res.currencies[0].code;
              serv.s_currency_symbol = res.currencies[0].symbol;
              this.loading_status = true;
              serv.s_data = room;
              this.fs.insertService(serv)
                .subscribe(res => {
                  
                  this.loading_status = false;
                }, err => {
                  console.log(err);
                })
            }
            , err => {
              console.log(err)
            })
        },
          err => {
            this.loading_status = false;
            console.log(err)
          })

    }

  }

  
  


}
