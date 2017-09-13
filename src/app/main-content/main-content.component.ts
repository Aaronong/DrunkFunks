import { Component, OnInit } from '@angular/core';
import { MenuService } from '../menu.service';

@Component({
  selector: 'ons-page[content]',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.css']
})
export class MainContentComponent implements OnInit {

  constructor(
    private menuService: MenuService
  ) { }

  ngOnInit() {
  }

  openMenu() {
    this.menuService.open();
  }

}
