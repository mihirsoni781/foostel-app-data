import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ServicesComponent} from './services/services.component';
import { RegisterServicesComponent } from './register-services/register-services.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import {SigninComponent} from './signin/signin.component';
import {RegisterComponent} from './register/register.component';
import {RegFoodCentersComponent} from './register-services/reg-food-centers/reg-food-centers.component';
import {RegHostelsComponent} from './register-services/reg-hostels/reg-hostels.component';
import {RegRoomsComponent} from './register-services/reg-rooms/reg-rooms.component';
import {UserComponent} from './signin/user/user.component';
import { ProfileComponent } from './signin/user/profile/profile.component';
import { SecurityComponent } from './signin/user/security/security.component';
import {UserServicesComponent} from './signin/user/user-services/user-services.component';
import {BillingComponent} from './signin/user/billing/billing.component';
import {ServiceDetailsComponent} from '../app/signin/user/service-details/service-details.component';
import { HostelDetailsComponent } from './signin/user/service-details/hostel-details/hostel-details.component';
import { RoomDetailsComponent } from './signin/user/service-details/room-details/room-details.component';
import { FoodCenterDetailsComponent } from './signin/user/service-details/food-center-details/food-center-details.component';
import { RoomComponent } from './services/room/room.component';
import { FoodComponent } from './services/food/food.component';
import { HostelComponent } from './services/hostel/hostel.component';
import { ViewImageComponent } from './view-image/view-image.component';
import { VieweditphotoComponent } from './signin/user/service-details/vieweditphoto/vieweditphoto.component';
const routes: Routes = [
  {
    path:'services',
    component: ServicesComponent,
    children:[
      {
        component: RoomComponent,
        path: 'room'
      },
      {
        component: FoodComponent,
        path: 'food'
      },
      {
        component: HostelComponent,
        path: 'hostel'
      }
    ]
  },
  {
    path:'about-us',
    component:AboutUsComponent
  },
  {
    path:'register-services',
    component:RegisterServicesComponent,
    children: [
        {
          path: 'register-rooms',
          component: RegRoomsComponent
        },
        {
          path: 'register-hostels',
          component: RegHostelsComponent
        },
        {
          path: 'register-food-centers',
          component: RegFoodCentersComponent
        }
      ]
  },
  {
    path:'contact-us',
    component: ContactUsComponent
  },
  {
    path:'signin',
    component: SigninComponent
  },
  {
    path:'register',
    component:RegisterComponent,
  },
  {
    path: 'user',
    component: UserComponent,
    children : [{
      path:'profile', component: ProfileComponent
    },{
      path:'services', component: UserServicesComponent,
    },
      {
        path: 'hostel-details', component: HostelDetailsComponent, children:[{component: VieweditphotoComponent, path: 'view-photo/:id'}]
      },
      {
        path: 'room-details', component: RoomDetailsComponent, children:[{component: VieweditphotoComponent, path: 'view-photo/:id'}]
      },
      {
        path: 'food-center-details', component: FoodCenterDetailsComponent, children:[{component: VieweditphotoComponent, path: 'view-photo/:id'}]
      },
      {
        component: VieweditphotoComponent,
        path: 'view-photo/:id'
      }
    ,{
      path: 'billing', component: BillingComponent
    },{
      path: 'security', component: SecurityComponent
    }]
  },
  {
    path: 'photos/:id',
    component: ViewImageComponent
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
