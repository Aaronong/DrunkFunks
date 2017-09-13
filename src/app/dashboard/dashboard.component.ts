import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { GroupService } from '../group.service';
import { LoginService } from '../login.service';
import { Group } from '../group';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @Input() groups: Group[] = null;

  constructor(
    private groupService: GroupService,
    private loginService: LoginService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.groupService.getGroupsByUserIdSlowly(this.loginService.getPlaceHolderUser()).then(groups => {
      this.groups = groups;
    })
  }

  enterGroup(group) {
    this.router.navigate(['/dashboard/group', group.id]);
  }

  newGroup() {

  }

}
