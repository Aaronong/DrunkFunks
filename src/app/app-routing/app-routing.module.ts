import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandingPageComponent }   from '../landing-page/landing-page.component';
import { AboutPageComponent } from '../about-page/about-page.component';
import { PrivacyPageComponent } from '../privacy-page/privacy-page.component';
import { TosPageComponent } from '../tos-page/tos-page.component';
import { PageNotFoundComponent }   from '../page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/main', pathMatch: 'full' },
  { path: 'main', component: LandingPageComponent },
  { path: 'about', component: AboutPageComponent },
  { path: 'privacy', component: PrivacyPageComponent },
  { path: 'tos', component: TosPageComponent },
  { path: '404', component: PageNotFoundComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}