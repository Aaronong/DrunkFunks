import { Component, OnInit } from '@angular/core';
import { MenuService } from '../menu.service';
import { LoginService } from '../login.service';
import { GroupService } from '../group.service';
import { User } from '../user';
import { Group } from '../group';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ons-page[side]',
  templateUrl: './side-drawer.component.html',
  styleUrls: ['./side-drawer.component.css']
})
export class SideDrawerComponent implements OnInit {

  private subLogin: Subscription;
  private subGroup: Subscription;
  public inDashboard: boolean;
  public isLoggedIn = false;
  public groups: Group[] = null;
  public loading = true; 

  constructor(
    private menuService: MenuService,
    private loginService: LoginService,
    private groupService: GroupService,
  ) {
    this.subLogin = this.loginService.getLoggedInObservable().subscribe(
      isLoggedIn => {
        this.isLoggedIn = isLoggedIn;
        if (isLoggedIn) {
          this.loading = true;
          this.groupService.getGroupsByUserIdSlowly(this.loginService.getPlaceHolderUser()).then(groups => {
            this.loading = false;
            this.groups = groups;
          })
        } else {
          this.closeMenu();
          this.groups = null;
        }
      }
    );
    this.subGroup = this.groupService.getCurrentGroupObservable().subscribe(
      currentGroup => {
        if (currentGroup) {
          if (currentGroup["groupName"] == "Dashboard") {
            this.inDashboard = true;
          } else {
            this.inDashboard = false;
          }
        } else {
          this.inDashboard = false;
        }
      }
    );
   }

  ngOnInit() {
    if (this.loginService.getProfile()) {
      this.loading = true;
      this.groupService.getGroupsOfUser()
      .then(groups => {
        this.loading = false;
        if (groups) {
          this.groups = groups;
        } else {
          this.groups = [];
        }        
      })
    }
  }

  closeMenu() {
    this.menuService.close();
  }

}