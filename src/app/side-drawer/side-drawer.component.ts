import { Component, OnInit } from '@angular/core';
import { MenuService } from '../menu.service';
import { LoginService } from '../login.service';
import { User } from '../user';

@Component({
  selector: 'ons-page[side]',
  templateUrl: './side-drawer.component.html',
  styleUrls: ['./side-drawer.component.css']
})
export class SideDrawerComponent implements OnInit {

  public user = {
    id: 0
  };

  constructor(
    private menuService: MenuService,
    private loginService: LoginService,
  ) {
    this.user.id = loginService.getPlaceHolderUser();
   }

  ngOnInit() {
  }

  closeMenu() {
    this.menuService.close();
  }

}