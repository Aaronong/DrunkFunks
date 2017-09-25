import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GroupService } from '../group.service';
import { UserService } from '../user.service';
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
  @ViewChild("modal_join") modalJoin;
  @ViewChild("modal_create") modalCreate;
  @ViewChild("modal_loading") modalLoading;

  private subLogin: Subscription;
  private subGroupChange: Subscription;

  public modalGroup = {
    name: "",
    password: "",
  }

  constructor(
    private groupService: GroupService,
    private userService: UserService,
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

    this.subGroupChange = this.groupService.getChangeGroupObservable().subscribe(
      groupChange => {
        if (groupChange) {
          if (groupChange == 'name taken') {
            this.modalCreate.nativeElement.show();
          } else {
            this.router.navigate(["/dashboard/group", groupChange]);
          }
        }
        this.modalLoading.nativeElement.hide();
      }
    )

    // Redirect to login if not logged in
    if (this.loginService.getProfile() == null) {
      this.router.navigate(["/login"]);
      return;
    }

    // Publish to all group listeners
    this.groupService.updateCurrentGroup({groupName: "Dashboard", routerLink: ['/dashboard']});

    this.groupService.getGroupsOfUser().then(groups => {
      this.groups = groups;
    })
  }

  enterGroup(group) {
    this.router.navigate(['/dashboard/group', group.groupId]);
  }

  createGroup() {
    if (this.modalGroup.name) {
      this.modalGroup.name = this.modalGroup.name.trim();
      if (this.modalGroup.name.length == 0) {
        ons.notification.toast('Invalid Name!', {timeout: 3000, modifier: 'red'});
        return;
      }
    } else {
      ons.notification.toast('Missing Name!', {timeout: 3000, modifier: 'red'});
      return;
    }

    if (this.modalGroup.password) {
      if(this.modalGroup.password.length < 8) {
        ons.notification.toast('Password too short!', {timeout: 3000, modifier: 'red'});
        return;
      }
    } else {
      ons.notification.toast('Missing Password!', {timeout: 3000, modifier: 'red'});
      return;
    }

    console.log(this.modalGroup);
    this.groupService.createGroup(this.modalGroup);
    this.modalCreate.nativeElement.hide();
    this.modalLoading.nativeElement.show();
  }

  joinGroup() {
    console.log(this.modalGroup);
    this.modalJoin.nativeElement.hide();
    this.modalLoading.nativeElement.show();
    this.userService.joinGroup(this.modalGroup)
    .then(groupId => {
      this.modalLoading.nativeElement.hide();
      if (groupId) {
        this.router.navigate(['dashboard/group', groupId]);
      }
    });
  }

  resetModal() {
    this.modalGroup = {
      name: "",
      password: "",
    }
  }
}
