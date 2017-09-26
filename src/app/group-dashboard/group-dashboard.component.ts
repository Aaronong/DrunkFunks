import { Component, OnInit, Input } from '@angular/core';
import { LoginService } from '../login.service';
import { GroupService } from '../group.service';
import { Group } from '../group';
import { User } from '../user';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-group-dashboard',
  templateUrl: './group-dashboard.component.html',
  styleUrls: ['./group-dashboard.component.css']
})
export class GroupDashboardComponent implements OnInit {

  @Input() group: Group;
  @Input() users: User[];

  public loading = true;
  public subLogin: Subscription;
  public currentUserId = 0;

  constructor(
    private loginService: LoginService,
    private groupService: GroupService,
    private route: ActivatedRoute,
    private router: Router,
  ) {

   }

  ngOnInit() {
    // Listen for logout
    this.subLogin = this.loginService.getLoggedInObservable().subscribe(
      isLoggedIn => {
        if (!isLoggedIn) {
          this.router.navigate(['/login']);
        }
      }
    )

    // Check if user is logged in
    if (!this.loginService.getProfile()) {
      this.router.navigate(['/login']);
      return;
    } else {
      this.currentUserId = this.loginService.getProfile().alfred.userId;
    }

    this.loading = true;
    this.route.paramMap
    .switchMap((params: ParamMap) => this.groupService.getGroupById(+params.get('id')))
    .subscribe(group => {
      this.loading = false;
      if (group == null) {
        this.group = null;
        return
      }

      if (!this.groupService.isInGroup(group, this.loginService.getPlaceHolderUser())) {
        // Prevent unauthorized access
        this.group = null;
      } else {
        // Publish to group listeners
        this.groupService.updateCurrentGroup({groupName: group.name, routerLink: ['/dashboard/group', group.groupId]});
        this.group = group;
        this.users = group.members;
      }
    });
  }

  leaveGroup() {
    if (this.group) {
      let leavingGroup = {
        groupId: this.group.groupId
      }
      this.groupService.leaveGroup(leavingGroup)
      .then(success => {
        if (success) {
          this.router.navigate(['/dashboard']); 
        }
      })
    }
  }

  deleteGroup() {
    this.leaveGroup();
  }
}
