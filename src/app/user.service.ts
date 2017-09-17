import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { User } from './user';
import { MOCK_USERS } from './mock-users';

@Injectable()
export class UserService {

  constructor(private http: Http) { }

  getAllUsers(): Promise<User[]> {
    return Promise.resolve(MOCK_USERS);
  }

  getUsersById(userId): Promise<User> {
    var user = null;
    var users = MOCK_USERS.filter(user => {
      return user.id == userId;
    })
    if (users.length > 0) {
      user = users[0];
    }
    return Promise.resolve(user);
  }

  getUsersByIdSlowly(userId): Promise<User> {
      return new Promise(resolve => {
          // Simulate server latency with 1 second delay
          setTimeout(() => resolve(this.getUsersById(userId)), 3000);
      });
  }
}