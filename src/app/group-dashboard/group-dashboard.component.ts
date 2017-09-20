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
    }

    this.route.paramMap
    .switchMap((params: ParamMap) => this.groupService.getGroupByIdSlowly(+params.get('id')))
    .subscribe(group => {
      this.loading = false;

      if (!this.groupService.isInGroup(group, this.loginService.getPlaceHolderUser())) {
        // Prevent unauthorized access
        this.group = null;
        return;
      }

      // Publish to group listeners
      this.groupService.updateCurrentGroup({groupName: group.name, routerLink: ['/dashboard/group', group.groupId]});
      this.group = group;
      // Debug Users (Mock Data)
      this.users = [
        new User(1, "1871358646211109@thealfredbutler.com",
          "Sky Levis", 1871358646211109, null, null, null, null),
        new User(2, "loojane_1995@hotmail.com", "See Loo Jane", 10155560371024404,
         null, null, null, null),
      ]
    });
  }
}
