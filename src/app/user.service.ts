import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { LoginService } from './login.service';
import { User } from './user';
import * as ons from "onsenui";
import { Observable, Subject } from "rxjs";

@Injectable()
export class UserService {

  private userUpdated = new Subject<boolean>();
  //private googleMapApiKey = "AIzaSyCMpuRlR_wcbQ28_13YFs1mEUl9Cl9Oni4"

  constructor(
    private http: Http,
    private loginService: LoginService,
  ) {

  }

  // getAllUsers(): Promise<User[]> {
  //   return [Promise.resolve(MOCK_USERS);]
  // }

  getUsersById(userId): Promise<User> {
    return this.loginService.secureApiGet('https://api.thealfredbutler.com/user/profile/' + userId)
    .then(this.deserialiseJSONToUser)
    .catch(this.handleError);
  }

  updateUserProfile(updateUser) {
    this.loginService.secureApiPost("https://api.thealfredbutler.com/user/update", JSON.stringify(updateUser))
    .then((res) => {
      console.log(res);
			if (res.json()['status'] == 'success') {
        ons.notification.toast("Changes Saved!", {
          timeout: 3000,
          modifier: "green"
        });
        this.userUpdated.next(true);
			} else if (res.json()['status'].indexOf("Error") != -1) {
        console.log(res.json()['status']);
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
    // return this.http.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + treatedAddress 
    // + "&key=" + this.googleMapApiKey)
    // .toPromise()
    // .then(response => {
    //   let json = response.json();
    //   let results = json.results;
    //   if (results.length > 0) {
    //     let loc = json.results[0].geometry.location;
    //     let lat = loc.lat;
    //     let lng = loc.lng;
    //     updateUser.longitude = lng;
    //     updateUser.latitude = lat;
    //     console.log(updateUser);
    //     return this.updateUserProfile(updateUser);
    //   } else {
    //     return this.updateUserProfile(updateUser);
    //   }
    // })
    // .catch(error => {
    //   updateUser.longitude = null;
    //   updateUser.latitude = null;
    //   return this.updateUserProfile(updateUser);
    // });
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