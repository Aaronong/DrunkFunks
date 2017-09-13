import { Component, OnInit } from '@angular/core';
import { MenuService } from '../menu.service';

@Component({
  selector: 'ons-page[side]',
  templateUrl: './side-drawer.component.html',
  styleUrls: ['./side-drawer.component.css']
})
export class SideDrawerComponent implements OnInit {

  constructor(private menuService: MenuService) { }

  ngOnInit() {
  }

  closeMenu() {
    this.menuService.close();
  }

}
