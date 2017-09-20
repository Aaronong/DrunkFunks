import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Group } from './group';
import { User } from './user';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class GroupService {

  private currentGroup = new Subject<Object>();

  constructor(
    private http: Http,
  ) { }

  // getAllGroups(): Promise<Group[]> {
  //   return Promise.resolve(MOCK_GROUPS);
  // }

  getGroupsByUserId(userId): Promise<Group[]> {
    return Promise.resolve([new Group(1, 'Test Group 1', 'password'),
                            new Group(2, 'Gin Gang', 'password123')]);
  }

  getGroupsByUserIdSlowly(userId): Promise<Group[]> {
      return new Promise(resolve => {
          // Simulate server latency with 1 second delay
          setTimeout(() => resolve(this.getGroupsByUserId(userId)), 2000);
      });
  }

  getGroupById(groupId): Promise<Group> {
    if (groupId == 1) {
      return Promise.resolve(new Group(1, 'Test Group 1', 'password'));
    } else if (groupId == 2) {
      return Promise.resolve(new Group(2, 'Gin Gang', 'password123'));
    } else {
      return Promise.resolve(null);
    }
  }

  getGroupByIdSlowly(groupId): Promise<Group> {
    return new Promise(resolve => {
        // Simulate server latency with 1 second delay
        setTimeout(() => resolve(this.getGroupById(groupId)), 2000);
    });
  }

  isInGroup(group: Group, userId): boolean {
    // if (group.owner == userId) {
    //   return true;
    // }

    // for (let member of group.members) {
    //   if (member.id == userId) {
    //     return true;
    //   }
    // }

    // return false;
    return true;
  }

  getCurrentGroupObservable(): Observable<Object> {
    return this.currentGroup.asObservable();
  }

  // newGroup = {groupName, routerLink}
  updateCurrentGroup(newGroup) {
    this.currentGroup.next(newGroup);
  }

}