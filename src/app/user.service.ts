import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { User } from './user';

@Injectable()
export class UserService {

  public debug: Object;

  constructor(private http: Http) {
    (<any>window).userService = this;
   }

  // getAllUsers(): Promise<User[]> {
  //   return [Promise.resolve(MOCK_USERS);]
  // }

  getUsersById(userId): Promise<User> {
    return this.http.get('https://api.thealfredbutler.com/user/' + userId)
    .toPromise()
    .then(this.deserialiseJSONToUser)
    .catch(this.handleError);
  }

  // getUsersByIdSlowly(userId): Promise<User> {
  //     return new Promise(resolve => {
  //         // Simulate server latency with 1 second delay
  //         setTimeout(() => resolve(this.getUsersById(userId)), 3000);
  //     });
  // }

  private deserialiseJSONToUser(json): User {
    console.log(json);
    this.debug = json.dataValues;
    let user = User.deserialiseJson(json);
    console.log(user);
		return user;
	}

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}