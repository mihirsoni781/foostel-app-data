import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FoostelservicesService } from '../foostelservices.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-view-image',
  templateUrl: './view-image.component.html',
  styleUrls: ['./view-image.component.css']
})
export class ViewImageComponent implements OnInit {
  imageId = null;
  constructor(public _loc: Location, private fs: FoostelservicesService, private http: HttpClient, private activeRoute: ActivatedRoute) {
  }
  imageDataUrl = null;
  loading = true;
  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.activeRoute.url.subscribe(res => {
      this.imageId = res[1].path;
      this.fs.getImageById(this.imageId)
        .subscribe(res => {
          this.imageDataUrl = res.fileData;
          this.loading = false;
        }, err => {
          console.log(err);
        })
    }, err => {
      console.log(err);
    })
  }
  exit() {
    
  }

}
