import { Component, OnInit } from '@angular/core';
import { MapserviceService } from '../../mapservice.service';
import { Service } from '../../../../server/models/service';
import { ResCountriesService } from '../../../app/res-countries.service';
import { FoostelservicesService } from '../../foostelservices.service';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
@Component({
  selector: 'app-reg-hostels',
  templateUrl: './reg-hostels.component.html',
  styleUrls: ['./reg-hostels.component.css']
})
export class RegHostelsComponent implements OnInit {
  service = null;
  loading_status = false;
  hostel = {
    hostel_type:"",
    room_type: {
      single_bed:{
        isset:0,
        rent_y:""
      },
      double_bed: {
        isset: 0,
        rent_y: ""
      },
      tripple_bed: {
        isset: 0,
        rent_y: ""
      },
      other: {
        isset: 0,
        rent_y: ""
      },
    },
    cm:"",
    meal_charge_y:"",
    facilities: {
      parking: 0,
      attached_bath: 0,
      housekeeping: 0,
      ac: 0,
      meal:0,
      gym:0,
      cloth_washing:0,
      other: ""
    }
  }

  turn = 0;
  constructor( private auth_: AuthService, public mapservice: MapserviceService, private cs: ResCountriesService, private fs: FoostelservicesService, private router: Router) {
    this.service = new Service('Hostel');

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
          res => {
            this.service.s_currency = res.currencies[0].code;
            this.service.s_currency_symbol = res.currencies[0].symbol;
          }
          , err => {
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
    this.service.s_data = this.hostel;
    
    this.fs.insertService(this.service)
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
      let hostel = {
        hostel_type: (i%2==0)?"boys":"girls",
        room_type: {
          single_bed: {
            isset: 1,
            rent_y: "50000"
          },
          double_bed: {
            isset: (i % 2 == 0) ? 1:0,
            rent_y: "100000"
          },
          tripple_bed: {
            isset: 1,
            rent_y: "60000"
          },
          other: {
            isset: 0,
            rent_y: ""
          },
        },
        cm: "4000",
        meal_charge_y: "10000",
        facilities: {
          parking: 0,
          attached_bath: 0,
          housekeeping: (i % 2 == 0) ?1:0,
          ac: 0,
          meal: 1,
          gym: 0,
          cloth_washing: (i % 2 == 0) ?0:1,
          other: ""
        }
      }

      function getRandomInt(min, max, i) {
        return min + ((max - min) * Math.random())
      }

      let serv = new Service('Hostel');

      serv.s_coords = { lng: getRandomInt(75.81605874212914, 75.92934313778699, i), lat: getRandomInt(22.671799937758905, 22.76897232233084, i) };
      serv.s_name = "Hostel test" + i;
      serv.owner_contact = '1234567890';
      serv.dc = '91';
      serv.s_data = hostel;
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
              serv.s_data = hostel;
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
