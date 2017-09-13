import { Component, ViewChild } from '@angular/core';
import { MainContentComponent } from './main-content/main-content.component';
import { SideDrawerComponent } from './side-drawer/side-drawer.component';
import { MenuService } from './menu.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public sideDrawer = SideDrawerComponent;
  public mainContent = MainContentComponent;

  @ViewChild('splitter') splitter;
  constructor(private menuService: MenuService) {
    this.menuService.menu$.subscribe((toggle) => {
      if (toggle) {
        this.splitter.nativeElement.side.open()
      } else {
        this.splitter.nativeElement.side.close()
      }
    });
  }
}
