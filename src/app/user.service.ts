import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { LoginService } from './login.service';
import { User } from './user';

@Injectable()
export class UserService {

  constructor(
    private http: Http,
    private loginService: LoginService,
  ) {}

  // getAllUsers(): Promise<User[]> {
  //   return [Promise.resolve(MOCK_USERS);]
  // }

  getUsersById(userId): Promise<User> {
    return this.loginService.secureApiGet('https://api.thealfredbutler.com/user/profile/' + userId)
    //return this.http.get('https://api.thealfredbutler.com/user/profile/' + userId)
    //.toPromise()
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
    let jsonArray = json.json()['user'];
    let user = User.deserialiseJson(jsonArray);
		return user;
	}

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}