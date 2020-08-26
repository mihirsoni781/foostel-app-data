import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { MapserviceService } from './mapservice.service';
import { features } from 'process';
import { FoostelservicesService } from './foostelservices.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  profile=false;
  constructor(public auth: AuthService, private mapservice: MapserviceService, private fs: FoostelservicesService, private router: Router){
    
  }
  ngOnInit():void{
    
  }
  title = 'foostel';
  

  
}
