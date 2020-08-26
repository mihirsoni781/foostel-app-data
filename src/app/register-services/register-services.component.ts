import { Component, OnInit } from '@angular/core';
import{Router} from '@angular/router';
@Component({
  selector: 'app-register-services',
  templateUrl: './register-services.component.html',
  styleUrls: ['./register-services.component.css']
})
export class RegisterServicesComponent implements OnInit {
  constructor(public router: Router) { }

  ngOnInit(): void {
  }

}
