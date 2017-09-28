import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { LoginService } from './login.service';
import { User } from './user';
import * as ons from "onsenui";
import { Observable, Subject } from "rxjs";

@Injectable()
export class UserService {

  private userUpdated = new Subject<boolean>();

  constructor(
    private http: Http,
    private loginService: LoginService,
  ) {

  }

  getUsersById(userId): Promise<User> {
    return this.loginService.secureApiGet('https://api.thealfredbutler.com/user/profile/' + userId)
    .then(this.deserialiseJSONToUser)
    .catch(this.handleError);
  }

  updateUserProfile(updateUser) {
    this.loginService.secureApiPost("https://api.thealfredbutler.com/user/update", JSON.stringify(updateUser))
    .then((res) => {
			if (res.json()['status'] == 'success') {
        ons.notification.toast("Changes Saved!", {
          timeout: 3000,
          modifier: "green"
        });
        this.userUpdated.next(true);
			} else if (res.json()['status'].indexOf("Error") != -1) {
        ons.notification.toast("An error occurred!", {
          timeout: 3000,
          modifier: "red"
        });
        this.userUpdated.next(false);
			}	
		});
  }

  getGeoCodeAndUpdate(updateUser) {
    var res = {longitude: null, latitude: null};

    if (updateUser.address) {
      var treatedAddress = updateUser.address.trim().replace(" ", "+");
    } else {
      return this.updateUserProfile(updateUser);
    }
    
    return this.updateUserProfile(updateUser);
  }

  public getUserObservable(): Observable<boolean> {
    return this.userUpdated.asObservable();
  }

  private deserialiseJSONToUser(json): User {
    let jsonArray = json.json()['user'];
    let user = User.deserialiseJson(jsonArray);
		return user;
	}

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}