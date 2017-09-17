import { Component, OnInit } from '@angular/core';
import * as ons from 'onsenui';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  loginWithFacebook() {
    ons.notification.toast('Login With Facebook', {timeout: 2000});
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
