import { Component, OnInit, Input } from '@angular/core';
import { LoginService } from '../login.service';
import { GroupService } from '../group.service';
import { Group } from '../group';
import { User } from '../user';
import { ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-group-dashboard',
  templateUrl: './group-dashboard.component.html',
  styleUrls: ['./group-dashboard.component.css']
})
export class GroupDashboardComponent implements OnInit {

  @Input() group: Group;
  @Input() users: User[];

  public loading = true;

  constructor(
    private loginService: LoginService,
    private groupService: GroupService,
    private route: ActivatedRoute,
  ) {
    
   }

  ngOnInit() {
    this.route.paramMap
    .switchMap((params: ParamMap) => this.groupService.getGroupByIdSlowly(+params.get('id')))
    .subscribe(group => {
      this.loading = false;

      if (!this.groupService.isInGroup(group, this.loginService.getPlaceHolderUser())) {
        // Prevent unauthorized access
        this.group = null;
        return;
      }
      this.group = group;
      this.users = group.members;
    });
  }
}
