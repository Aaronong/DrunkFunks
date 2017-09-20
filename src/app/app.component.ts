import { Component, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from "@angular/router";
import { MainContentComponent } from './main-content/main-content.component';
import { SideDrawerComponent } from './side-drawer/side-drawer.component';
import { GoogleAnalyticsEventsService } from './google-analytics-events.service';
import { MenuService } from './menu.service';

declare let ga: Function

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public sideDrawer = SideDrawerComponent;
  public mainContent = MainContentComponent;

  @ViewChild('splitter') splitter;
  constructor(
    private menuService: MenuService,
    public router: Router,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
  ) {
    // Setup Menu Splitter
    this.menuService.menu$.subscribe((toggle) => {
      if (toggle) {
        this.splitter.nativeElement.side.open()
      } else {
        this.splitter.nativeElement.side.close()
      }
    });
    // Setup Google Analytics
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        ga('set', 'page', event.urlAfterRedirects);
        ga('send', 'pageview');
      }
    }); 
  }

  submitEvent() {
    this.googleAnalyticsEventsService.emitEvent("testCategory", "testAction", "testLabel", 10);
  }
}
