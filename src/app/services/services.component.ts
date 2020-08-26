import { Component, OnInit } from '@angular/core';
import { Routes, ActivatedRoute, Router, Params } from '@angular/router';
import { MapserviceService } from '../mapservice.service';
import { FoostelservicesService } from '../foostelservices.service';
import { DropDownList } from '../../assets/tools/drop-down-list';
import { templateJitUrl } from '@angular/compiler';
@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})

export class ServicesComponent implements OnInit {

  defaults = [];
  windowWidth=null;
  services = {
    'room': 'Room',
    'rooms': 'Room',
    'roooms': 'Room',
    'roms': 'Room',
    'home': 'Room',
    'house': 'Room',
    'rms': 'Room',

    'hostel': 'Hostel',
    'hostels': 'Hostel',
    'hostal': 'Hostel',
    'hostals': 'Hostel',
    'hosel': 'Hostel',
    'hostl': 'Hostel',
    'hostls': 'Hostel',

    'food': 'Food Center',
    'mes': 'Food Center',
    'mess': 'Food Center',
    'tiffin': 'Food Center',
    'tiffen': 'Food Center',
    'tiffen centers': 'Food Center',
    'tiffen center': 'Food Center',
    'tiffin centers': 'Food Center',
    'tiffin center': 'Food Center',
    'food centers': 'Food Center',
    'foods': 'Food Center',
    'meals': 'Food Center',
    'meal': 'Food Center',
    'food center': 'Food Center'
  }

  usedWords = {
    'near': 1, 'at': 1, 'in': 1, 'located': 1
  }

  
  result=null;

  salert = null;

  constructor(public mapservice: MapserviceService, private activatedRoute: ActivatedRoute, 
      private fs: FoostelservicesService, public router: Router)
    {
    }

  sloading=false;

  drop_logo = "fa fa-angle-down";


  nearMeList = new DropDownList(["Room", "Hostel", "Food"]);




  dd1 = new DropDownList(['Rooms', 'Hostels', 'Food Centers']);

  
  sortselect=null;
  ngOnInit(): void {
    let flag = true;
    this.sortselect = new DropDownList(['Cheapest First', 'Nearest First', 'Expensive First']);
    this.sortselect.select("Sort by");
    this.nearMeList.select("Room");
    this.windowWidth = window.innerWidth;
    
    
  }

  data=[];

  alert=null;
  searchString = "";
  seachOBJ=null;
  search(options?) {
      if(this.router.url!='/services'){
        this.router.navigate(['services'])
      }
      this.sloading=true;
      let ss = this.searchString;
      let url = this.router.url;
      let searchOBJ = {
        type: null,
        loc: null,
        ss: ""
      }
      let sArray = ss.split(" ");
      

      for (let i = 0; i < sArray.length; i++) {
        sArray[i] = sArray[i].toLowerCase();
        
        if (this.services[sArray[i]]) {
          if(!searchOBJ.type)
          {
            searchOBJ.type = this.services[sArray[i]];
            sArray[i]="";
          }
        }

        if (this.usedWords[sArray[i]]) {
          sArray[i]=""
        }
      }

      searchOBJ.loc = sArray.join(" ");
      
      //let userLoc = {lng: null, lat:null};
      /*
      */


      this.mapservice.forwardGeoCode(searchOBJ.loc)
        .subscribe(res => {
          searchOBJ.ss = searchOBJ.loc;
          searchOBJ.loc = res.features[0];
          /*if(searchOBJ.loc.place_name.split(",").length<=2)
          {
            this.alert = 'Search any place in '+searchOBJ.loc.place_name+' where you are looking for '+searchOBJ.type;
            return;
          }
          else{
            this.alert=null;
          }*/
          this.fs.search(searchOBJ)
            .subscribe(
              res => {
                
                this.data=res;
                this.result = res;
                if(!this.result.length)
                {
                  this.salert = "No results found near "+searchOBJ.loc.place_name;
                  this.sloading=false;
                  
                  this.refreshMap()
                  return;
                }
                else{
                  this.salert = null;
                }
                this.filter_.type=res[0].s_type;
                this.filter_.disp = 0;
                this.mapservice.initMap([res[0].s_coords.lng, res[0].s_coords.lat]);
                this.mapservice.addImages();
                this.mapservice.addSource(res,res[0].s_type.toLowerCase());
                this.mapservice.addLayer(res[0].s_type.toLowerCase(), res[0].s_type);
                document.getElementById('mapp').style.marginTop = '2px';

                if(options? options['nearme']:0){
                  this.sortResult('Nearest First');
                }
                this.sloading=false;
              },
              err => console.error(err)
            )
        }, err => {
          console.log(err)
        })
  }


  userLoc = {
    lng:null,
    lat:null
  };

  vis='not-visible'

  searchNearMe(type){
    if(type=='null')
      return
    this.sloading=true;
    let user = this.userLoc;
    if (navigator.geolocation) {
      var bound = (function getPosition(pos) {
        user.lng = pos.coords.longitude;
        user.lat = pos.coords.latitude;
        this.mapservice.reverseGeoCode(user)
          .subscribe(res=>{
            let place = res.features[0].place_name;
            
            let searchOBJ = {
              type: null,
              loc: null,
              ss: ""
            }
            this.searchString = type+' near '+ place;
            this.search({nearme:1});
            
          },err=>{
            console.log(err)
          })

      }).bind(this);

      navigator.geolocation.getCurrentPosition(bound);
    }


  }


  sortResult(i)
  {
    this.sortselect.select(i);
    
    switch(i){
      case 'Nearest First':
        let user = this.userLoc;
        if (navigator.geolocation) {
          var bound = (function getPosition(pos) {
            user.lng = pos.coords.longitude;
            user.lat = pos.coords.latitude;
            this.result.sort((a, b) => (((user.lat - a.s_coords.lat) * (user.lat - a.s_coords.lat) + (user.lng - a.s_coords.lng) * (user.lng - a.s_coords.lng))
              >= ((user.lat - b.s_coords.lat) * (user.lat - b.s_coords.lat) + (user.lng - b.s_coords.lng) * (user.lng - b.s_coords.lng))) ? 1 : -1);
            if(!this.result[0])
              return
            this.mapservice.setCenter(this.result[0].s_coords);
          }).bind(this);
          navigator.geolocation.getCurrentPosition(bound);
        }
        break;

        function minCost(serv) {
          var min = 10000 * 10000 * 9999;
          if(serv.s_type=='Room')
          {
            for (let i in serv.s_data.room_types) {
              if ((parseInt(serv.s_data.room_types[i].cm) + parseInt(serv.s_data.room_types[i].rent)) < min) {
                min = (parseInt(serv.s_data.room_types[i].cm) + parseInt(serv.s_data.room_types[i].rent));
              }
            }

          }
          else if(serv.s_type=='Hostel')
          {
            for (let i in serv.s_data.room_type) {
              if ((parseInt(serv.s_data.cm) + parseInt(serv.s_data.room_type[i].rent_y)) < min) {
                min = (parseInt(serv.s_data.cm) + parseInt(serv.s_data.room_type[i].rent_y));
              }
            }
          }
          else if(serv.s_type=='Food Center')
          {
            if (((parseInt(serv.s_data.meal.breakfast.bcpm) + parseInt(serv.s_data.meal.lunch.lcpm) + parseInt(serv.s_data.meal.dinner.dcpm))/3) < min) {
              min = ((parseInt(serv.s_data.meal.breakfast.bcpm) + parseInt(serv.s_data.meal.lunch.lcpm) + parseInt(serv.s_data.meal.dinner.dcpm)) / 3);
            }
          }
          return min;
        }


      case 'Cheapest First':
          this.result.sort((a, b) => (minCost(a) >= minCost(b) ?1:-1)) 
          this.mapservice.setCenter(this.result[0].s_coords);
          break;
        
      case 'Expensive First':
          this.result.sort((a, b) => (minCost(a) <= minCost(b) ? 1 : -1))
          this.mapservice.setCenter(this.result[0].s_coords);
          break;
    }
  }

  
  room_filter ={
    s_data :{
      for:{
        gender:'null',
        type:'null'
      },
      room_types:{
        _1_room:{
          isset:0
        },
        _2_room: {
          isset: 0
        },
        with_kichen_room: {
          isset: 0
        }
      },
      facilities:{
        parking:0,
        attached_bath:0,
        housekeeping:0,
        bed:0,
        ac:0
      }
    }
  }


  hostel_filter = {
    hostel_type: 'null',
    room_type: {
      single_bed: {
        isset: 0
      },
      double_bed: {
        isset: 0
      },
      tripple_bed: {
        isset: 0
      }
    },
    facilities: {
      parking: 0,
      attached_bath: 0,
      housekeeping: 0,
      ac: 0,
      meal: 0,
      gym: 0,
      cloth_washing: 0
    }
  }
  

  food_center_filter = {
    meal: {
      breakfast: {
        isset: 0,
      },
      lunch: {
        isset: 0,
      }
      ,
      dinner: {
        isset: 0,
      }
    },
    facilities: {
      customization: 0,
      home_delivery: 0,
      come_eat: 0
    }
  }






  filterRoom(){
    this.result = [];
    this.filter_.disp=0;
    for(let i of this.data){
      let iStat = true;
      if ((i.s_data.for.gender != this.room_filter.s_data.for.gender && this.room_filter.s_data.for.gender!='null') || (i.s_data.for.type != this.room_filter.s_data.for.type && this.room_filter.s_data.for.type!='null'))
      {
        continue;
      }
      
      for(let key in this.room_filter.s_data.room_types)
      {
        if (this.room_filter.s_data.room_types[key].isset)
        {
          if(!i.s_data.room_types[key].isset)
          {
            iStat=false;
          }
        }
      }
      
      for(var key in this.room_filter.s_data.facilities)
      {
        if(this.room_filter.s_data.facilities[key])
        {
          if (!i.s_data.facilities[key])
          {
            iStat=false;
            break;
          }
        }
      }
      
      if(iStat)
      {
        this.result.push(i);
      }
    }
    this.sortResult(this.sortselect.selected);
    if (!this.result.length) {
      this.salert = "No results matching your preferences. ";
      this.sloading = false;
      this.refreshMap()
      return;
    }
    else {
      this.salert = null;
    }
    this.refreshMap();
  }







  filterHostel() {
    this.result = [];
    this.filter_.disp = 0;
    for (let i of this.data) {
      let iStat = true;
      if ((i.s_data.hostel_type != this.hostel_filter.hostel_type && this.hostel_filter.hostel_type != 'null')) {
        
        continue;
      }

      for (let key in this.hostel_filter.room_type) {
        if (this.hostel_filter.room_type[key].isset) {
          if (!i.s_data.room_type[key].isset) {
            iStat = false;
            
          }
        }
      }

      for (var key in this.hostel_filter.facilities) {
        if (this.hostel_filter.facilities[key]) {
          if (!i.s_data.facilities[key]) {
            iStat = false;
            break;
          }
        }
      }

      if (iStat) {
        this.result.push(i);
      }
    }

    this.sortResult(this.sortselect.selected);
    if (!this.result.length) {
      this.salert = "No results matching your preferences.";
      this.sloading = false;
      this.refreshMap()
      return;
    }
    else {
      this.salert = null;
    }
    this.refreshMap();
  }



  filterFoodCenter() {
    this.result = [];
    this.filter_.disp = 0;
    for (let i of this.data) {
      let iStat = true;

      for (let key in this.food_center_filter.meal) {
        if (this.food_center_filter.meal[key].isset) {
          if (!i.s_data.meal.isset) {
            iStat = false;
          }
        }
      }

      for (var key in this.food_center_filter.facilities) {
        if (this.food_center_filter.facilities[key]) {
          if (!i.s_data.facilities[key]) {
            iStat = false;
            break;
          }
        }
      }

      if (iStat) {
        this.result.push(i);
      }
    }

    this.sortResult(this.sortselect.selected);
    if (!this.result.length) {
      this.salert = "No results matching your preferences.";
      this.sloading = false;
      this.refreshMap()
      return;
    }
    else {
      this.salert = null;
    }
    this.refreshMap();
  }





  
  refreshMap(){
    
    if(!this.result.length || !this.result){
      this.mapservice.map.remove();
      this.mapservice.map = null;   
      return;
    }
    this.mapservice.map = null;
    this.mapservice.initMap([this.result[0].s_coords.lng, this.result[0].s_coords.lat]);
    this.mapservice.addImages();
    this.mapservice.addSource(this.result, this.result[0].s_type.toLowerCase());
    this.mapservice.addLayer(this.result[0].s_type.toLowerCase(), this.result[0].s_type);
  }
  print(div)
  {
    
  }
  filter_={
    type:null,
    disp:0
  }

  mapToggle(elm,res){
    let map = document.getElementById('mapp');
    if(map.className=='not-visible')
    {
      map.className='visible';
      res.style.display = 'none';
      elm.style.opacity = 1;
      elm.innerHTML = 'Hide Map';
      
    }
    else {
      map.className= 'not-visible';
      res.style.display = 'block';
      elm.style.opacity = .4;
      elm.innerHTML = 'Show Map';
      
    }
  }

  viewd(s_index) {
    let service = this.result[s_index];
    if (service.s_type == 'Room') {
      this.router.navigate(['services/room'], { queryParams: { sid: service._id } })
    }
    if (service.s_type == "Hostel") {
      this.router.navigate(['services/hostel'], { queryParams: { sid: service._id } })
    }
    if (service.s_type == "Food Center") {
      this.router.navigate(['services/food'], { queryParams: { sid: service._id } })
    }
  }
}

