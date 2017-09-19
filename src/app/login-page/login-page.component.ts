import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import * as ons from 'onsenui';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  private subLogin: Subscription;

  constructor(
    private loginService: LoginService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.subLogin = this.loginService.getLoggedInObservable().subscribe(
      isLoggedIn => {
        if (isLoggedIn) {
          // redirect reactive
          this.router.navigate(["/dashboard"]);
        }
      }
    )

    // if already logged in, redirect
    if (this.loginService.getProfile() != null) {
      this.router.navigate(["/dashboard"]);
    }
  }

  toggleFacebookLogin() {
    this.loginService.toggleFacebookLogin(); 
  }

  signIn() {
    ons.notification.toast('Sign In', {timeout: 2000});
  }

  signUp() {
    ons.notification.toast('Sign Up', {timeout: 3000, modifier: 'green'});
  }

  onChange() {
    
  }

}
