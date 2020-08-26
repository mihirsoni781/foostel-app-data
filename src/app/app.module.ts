import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServicesComponent } from './services/services.component';
import { RegisterServicesComponent } from './register-services/register-services.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { SigninComponent } from './signin/signin.component';
import { RegisterComponent } from './register/register.component';
import { RegRoomsComponent } from './register-services/reg-rooms/reg-rooms.component';
import { RegHostelsComponent } from './register-services/reg-hostels/reg-hostels.component';
import { RegFoodCentersComponent } from './register-services/reg-food-centers/reg-food-centers.component';
import { FormsModule } from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { UserComponent } from './signin/user/user.component';
import { AuthService } from './auth.service';
import{ TokenInterceptorService} from './token-interceptor.service';
import { ProfileComponent } from './signin/user/profile/profile.component';
import { SecurityComponent } from './signin/user/security/security.component';
import { BillingComponent } from './signin/user/billing/billing.component';
import { UserServicesComponent } from './signin/user/user-services/user-services.component';
import { ServiceDetailsComponent } from './signin/user/service-details/service-details.component';
import { HostelDetailsComponent } from './signin/user/service-details/hostel-details/hostel-details.component';
import { RoomDetailsComponent } from './signin/user/service-details/room-details/room-details.component';
import { FoodCenterDetailsComponent } from './signin/user/service-details/food-center-details/food-center-details.component';

import { RoomComponent } from './services/room/room.component';
import { HostelComponent } from './services/hostel/hostel.component';
import { FoodComponent } from './services/food/food.component';
import { NgxImageCompressService } from 'ngx-image-compress';
import { FoostelservicesService } from './foostelservices.service';
import { ViewImageComponent } from './view-image/view-image.component';
import { VieweditphotoComponent } from './signin/user/service-details/vieweditphoto/vieweditphoto.component';
@NgModule({
  declarations: [
    AppComponent,
    ServicesComponent,
    RegisterServicesComponent,
    AboutUsComponent,
    ContactUsComponent,
    SigninComponent,
    RegisterComponent,
    RegRoomsComponent,
    RegHostelsComponent,
    RegFoodCentersComponent,
    UserComponent,
    ProfileComponent,
    SecurityComponent,
    BillingComponent,
    UserServicesComponent,
    ServiceDetailsComponent,
    HostelDetailsComponent,
    RoomDetailsComponent,
    FoodCenterDetailsComponent,
    RoomComponent,
    HostelComponent,
    FoodComponent,
    ViewImageComponent,
    VieweditphotoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [AuthService,FoostelservicesService,NgxImageCompressService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
