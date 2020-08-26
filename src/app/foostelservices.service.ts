import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { NgxImageCompressService } from 'ngx-image-compress';
import { RouteConfigLoadEnd, Router } from '@angular/router';
import { of, observable, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FoostelservicesService {
  prefix = ''

  insertServiceUrl = "/api/insertService";
  getUserServiceUrl = "/api/getUserService/";
  getUserServicesUrl = "/api/getServicesByUser";
  updateServiceUrl = "/api/updateService";
  searchUrl = "/api/search";
  getServiceUrl = "/api/getService/";
  
  constructor(private _http: HttpClient, private compressor: NgxImageCompressService, private router : Router) { }

  insertService(service){
    return <any>this._http.post(this.prefix+this.insertServiceUrl, { service: service});
  }

  getUserServices(){
    return <any>this._http.get(this.prefix +this.getUserServicesUrl);
  }
  getUserService(sid){
    return <any>this._http.get(this.prefix +this.getUserServiceUrl+sid+"");
  }

  updateService(service)
  {
    //console.log("Updating");
    return <any>this._http.put(this.prefix +this.updateServiceUrl,{service:service});
  }

  search(obj)
  {
    return <any>this._http.post(this.prefix +this.searchUrl, {searchObj: obj});
  }

  getService(sid){
    return <any>this._http.get(this.prefix +this.getServiceUrl+sid);
  }

  
  

  uploadStatus = { upload: 0 }

  uploadImage = function (files,i,service_id?,observer?){
    if(i>=files.length){
      //console.log("***********************************************************");
      if(observer)
      {
        observer.complete();
      }
      return 1;
    }
    var file = files[i];
    //console.log("WORKING WITH: " + file.name);
    let reader = new FileReader();
    let image;
    reader.readAsDataURL(file);
    var imagC = this.compressor;
    var http = this._http;
    var filewas = file.size;
    var comp;
    if (file.size >= 1000000) {
      comp = 30;
    }
    else {
      comp = 85;
    }


    //****************/
    var us=this.uploadStatus;    
    reader.onload = function () {
      image = reader.result;
      imagC.compressFile(image, null, comp, comp).then(result => {

        function dataURLtoFile(dataurl, filename) {
          var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);

          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }

          return new File([u8arr], filename, { type: mime });
        }

        console.warn(' compressed as ' + comp + ' Size in bytes:', imagC.byteCount(result));

        imagC.compressFile(result,null,20,20).then(res=>{
          let newImage = dataURLtoFile(result, file.name);
          ////console.log(newImage);
          console.log("%: " + (100 * imagC.byteCount(result)) / filewas);
          let formdata = new FormData();
          formdata.append('file', newImage);
          formdata.append('sid',service_id);
          formdata.append('tn',res);
          //console.log(result);
          //console.log(formdata['file']);
  
          var uploadImageServiceUrl = this.prefix +"/api/upload";
  
          http.post(uploadImageServiceUrl,formdata)
            .subscribe(res=>{
              //console.log(res);
              //console.log("THIS UPLOAD: ");
              //console.log(this.uploadStatus);
              this.uploadStatus.upload+=1;
              i+=1;
              this.uploadImage(files,i,service_id,observer);
              
            },err=>{
              this.uploadStatus.upload=0;
              console.log(err);
            });

        })


      })
    }.bind(this);
    return 1;
  }

  getImageById(id){
    return <any>this._http.get(this.prefix +'/api/photos/'+id);
  }
  deleteImage(id,sid){
    return <any>this._http.post(this.prefix +'/api/deleteImage',{id: id, sid: sid});
  }

  

}
