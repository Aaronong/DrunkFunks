import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { OnsenModule } from 'ngx-onsenui';
import { HttpModule } from '@angular/http';
import { FacebookModule } from 'ngx-facebook';
import { AgmCoreModule } from '@agm/core';

import { MenuService } from './menu.service';
import { LoginService } from './login.service';
import { UserService } from './user.service';
import { GroupService } from './group.service';
import { DirectionsService } from './directions.service';
import { GoogleAnalyticsEventsService } from "./google-analytics-events.service";

import { AppComponent } from './app.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { LandingPageComponent } from './landing-page/landing-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { PrivacyPageComponent } from './privacy-page/privacy-page.component';
import { TosPageComponent } from './tos-page/tos-page.component';
import { SideDrawerComponent } from './side-drawer/side-drawer.component';
import { MainContentComponent } from './main-content/main-content.component';
import { MainFooterComponent } from './main-footer/main-footer.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { GroupDashboardComponent } from './group-dashboard/group-dashboard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateGroupComponent } from './create-group/create-group.component';
import { CabhomeComponent } from './cabhome/cabhome.component';
import { DirectionsRendererComponent } from './directions-renderer/directions-renderer.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    PageNotFoundComponent,
    AboutPageComponent,
    PrivacyPageComponent,
    TosPageComponent,
    SideDrawerComponent,
    MainContentComponent,
    MainFooterComponent,
    LoginPageComponent,
    GroupDashboardComponent,
    UserProfileComponent,
    DashboardComponent,
    CreateGroupComponent,
    CabhomeComponent,
    DirectionsRendererComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    OnsenModule,
    HttpModule,
    FacebookModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC8u1kP6YBsr68jScWoTYozC9ZXj8nu9pQ'
    })
  ],
  providers: [
    MenuService,
    LoginService,
    UserService,
    GroupService,
    DirectionsService,
    GoogleAnalyticsEventsService,
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
  entryComponents: [
    SideDrawerComponent,
    MainContentComponent,
  ]
})
export class AppModule { }
