import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { LoginService } from './login.service';
import { Group } from './group';
import { User } from './user';
import { Subject, Observable } from 'rxjs';
import * as ons from "onsenui";

@Injectable()
export class GroupService {

  private currentGroup = new Subject<Object>();
  private changeGroup = new Subject<string>();

  constructor(
    private http: Http,
    private loginService: LoginService,
  ) { }

  // getAllGroups(): Promise<Group[]> {
  //   return Promise.resolve(MOCK_GROUPS);
  // }

  getGroupsOfUser(): Promise<Group[]> {
    return this.loginService.secureApiGet('https://api.thealfredbutler.com/membership')
    .then(this.deserialiseJSONToGroups)
    .catch(this.handleError);
  }

  getGroupsByUserIdSlowly(userId): Promise<Group[]> {
      return new Promise(resolve => {
          // Simulate server latency with 1 second delay
          //setTimeout(() => resolve(this.getGroupsByUserId(userId)), 2000);
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

  createGroup(newGroup) {
    this.loginService.secureApiPost("https://api.thealfredbutler.com/group/create", JSON.stringify(newGroup))
    .then((res) => {
      console.log(res);
			if (res.json()['status'] == 'success') {
        ons.notification.toast("Group Created!", {
          timeout: 3000,
          modifier: "green"
        });
        this.changeGroup.next(res.json()['groupId']);
      } else if (res.json()['status'] == 'name taken') {
        ons.notification.toast("Name Taken!", {
          timeout: 3000,
          modifier: "red"
        });
        this.changeGroup.next("name taken");
			} else if (res.json()['status'] == 'error') {
        ons.notification.toast("An error occurred!", {
          timeout: 3000,
          modifier: "red"
        });
        this.changeGroup.next(null);
			}	
		});
  }

  getCurrentGroupObservable(): Observable<Object> {
    return this.currentGroup.asObservable();
  }

  getChangeGroupObservable(): Observable<string> {
    return this.changeGroup.asObservable();
  }

  // newGroup = {groupName, routerLink}
  updateCurrentGroup(newGroup) {
    this.currentGroup.next(newGroup);
  }

  private deserialiseJSONToGroups(json): Group[] {
		let jsonArray = json.json()['group'];
		let groups = jsonArray.map(groupJSON => {
			let deserialisedGroup = Group.deserialiseJson(groupJSON);
			return deserialisedGroup;
		});
		//console.log(groups);
		return groups;
	}

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}