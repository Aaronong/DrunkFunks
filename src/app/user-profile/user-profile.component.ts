import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service'
import { LoginService } from '../login.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  user: User = null;
  isOwner: boolean = false;
  loading: boolean = true;
  subLogin: Subscription;
  validMail = false;
  validNumber = false;

  constructor(
    private userService: UserService,
    private loginService: LoginService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    // Listen for logout
    this.subLogin = this.loginService.getLoggedInObservable().subscribe(
      isLoggedIn => {
        if (!isLoggedIn) {
          // Else redirect to login
          this.router.navigate(["/login"]);
        }
      }
    )
   }

  ngOnInit() {
    // Check if logged in
    if (this.loginService.getProfile() == null) {
      // Else redirect to login
      this.router.navigate(["/login"]);
      return;
    }

    this.validMail = false;
    this.validNumber = false;
    this.loading = true;
    this.route.paramMap
    .switchMap((params: ParamMap) => this.userService.getUsersById(+params.get('id')))
    .subscribe(user => {
      if (user == null) {
        this.user = null;
        this.loading = false;
      } else {
        this.user = user; 
        // Check User Object
        if (this.user.userId == this.loginService.getProfile().alfred.userId) {
          this.isOwner = true;
        }
        if (this.user.email) {
          if ((this.user.email.indexOf("@thealfredbutler.com") == -1) && (this.user.email.length > 0)) {
            this.validMail = true;
          }
        }
        if (this.user.contactNumber) {
          this.user.contactNumber = this.user.contactNumber.trim().replace(" ", "");
          if (this.user.contactNumber.length > 0) {
            this.validNumber = true;
          }
        }
        // Check owner
        if (!this.isOwner) {
          if (!this.user.contactNumber) {
            this.user.contactNumber = "Not Available";
          }
          if (!this.user.address) {
            this.user.address = "Not Available";
          }
        }
        this.loading = false;
      }
    });
  }

  saveChanges() {
    console.log(this.user);
  }
}
