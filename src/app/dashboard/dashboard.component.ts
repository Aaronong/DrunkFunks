import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { GroupService } from '../group.service';
import { LoginService } from '../login.service';
import { Group } from '../group';
import { Subscription } from 'rxjs';
import * as ons from 'onsenui';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @Input() groups: Group[] = null;

  private subLogin: Subscription;

  public modalGroup = {
    name: "",
    password: "",
  }

  constructor(
    private groupService: GroupService,
    private loginService: LoginService,
    private router: Router,
  ) {
    
   }

  ngOnInit() {
    // Listen for logout
    this.subLogin = this.loginService.getLoggedInObservable().subscribe(
      isLoggedIn => {
        if (!isLoggedIn) {
          // Redirect to login if logged out
          this.router.navigate(["/login"]);
        }
      }
    )

    // Redirect to login if not logged in
    if (this.loginService.getProfile() == null) {
      this.router.navigate(["/login"]);
      return;
    }

    // Publish to all group listeners
    this.groupService.updateCurrentGroup({groupName: "Dashboard", routerLink: ['/dashboard']});

    this.groupService.getGroupsByUserIdSlowly(this.loginService.getPlaceHolderUser()).then(groups => {
      this.groups = groups;
    })
  }

  enterGroup(group) {
    this.router.navigate(['/dashboard/group', group.groupId]);
  }

  createGroup() {
    console.log(this.modalGroup);
    ons.notification.toast('Group Created!', {timeout: 3000, modifier: 'green'});
  }

  joinGroup() {
    console.log(this.modalGroup);
    ons.notification.toast('Joined Group!', {timeout: 3000, modifier: 'green'});
  }

  resetModal() {
    this.modalGroup = {
      name: "",
      password: "",
    }
  }
}
