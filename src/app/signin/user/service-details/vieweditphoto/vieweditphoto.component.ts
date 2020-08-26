import { Component, OnInit } from '@angular/core';
import { FoostelservicesService } from 'src/app/foostelservices.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';
@Component({
  selector: 'app-vieweditphoto',
  templateUrl: './vieweditphoto.component.html',
  styleUrls: ['./vieweditphoto.component.css']
})
export class VieweditphotoComponent implements OnInit {
  imageId = null;
  constructor( public _loc : Location, private fs: FoostelservicesService, private http: HttpClient, private activeRoute: ActivatedRoute) {
  }
  imageDataUrl = null;
  loading=true;
  ngOnInit(): void {
    window.scrollTo(0,0);
    //console.log("VIEWPHOTo");
    this.activeRoute.url.subscribe(res => {
      //console.log(res);
      this.imageId = res[1].path;
      this.fs.getImageById(this.imageId)
        .subscribe(res => {
          //console.log(res);
          this.imageDataUrl = res.fileData;
          this.loading=false;
        }, err => {
          console.log(err);
        })
    }, err => {
      console.log(err);
    })
  }
  exit()
  {
    //console.log("BLOKCER");
  }

}
