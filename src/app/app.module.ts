import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { OnsenModule } from 'ngx-onsenui';

import { MenuService } from './menu.service';

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
    MainFooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    OnsenModule,
  ],
  providers: [
    MenuService,
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
