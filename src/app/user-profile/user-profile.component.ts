import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service'
import { LoginService } from '../login.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  user: User = null;
  isOwner: boolean = false;
  loading: boolean = true;

  constructor(
    private userService: UserService,
    private loginService: LoginService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.paramMap
    .switchMap((params: ParamMap) => this.userService.getUsersByIdSlowly(+params.get('id')))
    .subscribe(user => {
      this.loading = false;
      this.user = user;
      if (this.user.id == this.loginService.getPlaceHolderUser()) {
        this.isOwner = true;
      }
    });
  }

}
