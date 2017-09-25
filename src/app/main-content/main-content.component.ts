import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from '../menu.service';
import { LoginService } from '../login.service';
import { GroupService } from '../group.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ons-page[content]',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.css']
})
export class MainContentComponent implements OnInit {

  private subLogin: Subscription;
  private subGroup: Subscription;
  public isLoggedIn: boolean = false;
  public currentGroup: Object = null;

  constructor(
    private menuService: MenuService,
    private loginService: LoginService,
    private groupService: GroupService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.subLogin = this.loginService.getLoggedInObservable().subscribe(
      (isLoggedIn) => {
        this.isLoggedIn = isLoggedIn;
      }
    );
    this.subGroup = this.groupService.getCurrentGroupObservable().subscribe(
      (obj) => {
        this.currentGroup = obj;
      }
    )
    if (this.loginService.getProfile()) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
  }

  openMenu() {
    if (this.isLoggedIn) {
      this.menuService.open();
    } else {
      this.router.navigate(["/main"]);
    }
  }

  onPreHide(event) {
    // Reserved for canceling prehide
  }

  logoutFacebook() {
    this.groupService.updateCurrentGroup(null);
    this.loginService.toggleFacebookLogin();
  }

  truncate(string) {
    if (string.length > 20 && string.indexOf(" ") !== -1) {
      return string.split(" ")[0];
    } else {
      return string;
    }
  }

}
