import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MapserviceService } from '../../mapservice.service';
import { Service } from '../../../../server/models/service';
import { ResCountriesService } from '../../../app/res-countries.service';
import { FoostelservicesService } from '../../foostelservices.service';
import { AuthService } from 'src/app/auth.service';
@Component({
  selector: 'app-reg-food-centers',
  templateUrl: './reg-food-centers.component.html',
  styleUrls: ['./reg-food-centers.component.css']
})
export class RegFoodCentersComponent implements OnInit {
  loading_status = false;
  service=null;
  fs = {
    type:"",
    meal:{
      breakfast:{
        isset:0,
        bcpm:"",
        timeIn:"7 AM",
        timeOut:"10 AM",
      },
      lunch: {
        isset: 0,
        lcpm: "",
        timeIn: "12 PM",
        timeOut: "3 PM"
      }
      ,
      dinner: {
          isset: 0,
          dcpm: "",
          timeIn: "8 PM",
          timeOut: "11 PM"
      }
    },
    facilities:{
      customization:0,
      home_delivery:0,
      come_eat:0,
      other:""
    }
}

  turn = 0;
  constructor( private auth_: AuthService, public mapservice: MapserviceService, private cs: ResCountriesService, private foostelservice: FoostelservicesService, private router: Router) {
    this.service = new Service('Food Center');

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
  next() {
    this.turn += 1;
  }
  previous() {
    if (this.turn > 0)
      this.turn -= 1
  }

  add() {
    this.loading_status = true;
    this.service.s_coords = this.mapservice.map._userCoors;
    this.mapservice.reverseGeoCode(this.service.s_coords)
      .subscribe(res => {
        this.service.s_loc = res.features;
        this.loading_status = false;
        let cc = res.features[res.features.length - 1].properties.short_code;
        this.cs.getCurrency(cc).subscribe(
          res=>{
            this.service.s_currency=res.currencies[0].code;
            this.service.s_currency_symbol = res.currencies[0].symbol;
          }
          ,err=>{
            console.log(err)
          })
        this.next();
      },
        err => {
          this.loading_status = false;
          console.log(err)
        })
  }

  insert() {
    this.service.s_data = this.fs;
    this.foostelservice.insertService(this.service)
      .subscribe(res => {
        this.next()
      }, err => {
        console.log(err);
      })
  }

  view() {
    this.router.navigate(['../../user/services']);
  }


  automate() {
    for (let i = 1; i < 10; i++) {
      let fs = {
        type: "Food Center",
        meal: {
          breakfast: {
            isset: 0,
            bcpm: "0",
            timeIn: "7 AM",
            timeOut: "10 AM",
          },
          lunch: {
            isset: 1,
            lcpm: "7000",
            timeIn: "12 PM",
            timeOut: "3 PM"
          }
          ,
          dinner: {
            isset: 1,
            dcpm: "7200",
            timeIn: "8 PM",
            timeOut: "11 PM"
          }
        },
        facilities: {
          customization: 0,
          home_delivery: 0,
          come_eat: 1,
          other: ""
        }
      }

      function getRandomInt(min, max, i) {
        return min + ((max - min) * Math.random())
      }

      let serv = new Service('Food Center');

      serv.s_coords = { lng: getRandomInt(75.81605874212914, 75.92934313778699, i), lat: getRandomInt(22.671799937758905, 22.76897232233084, i) };
      serv.s_name = "Food Center test" + i;
      serv.owner_contact = '1234567890';
      serv.dc = '91';
      serv.s_data = fs;
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
              serv.s_data = fs;
              this.foostelservice.insertService(serv)
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
