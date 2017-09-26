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
  private changeGroup = new Subject<boolean>();

  constructor(
    private http: Http,
    private loginService: LoginService,
  ) { }

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
    return this.loginService.secureApiGet('https://api.thealfredbutler.com/group/' + groupId)
    .then(this.deserialiseJSONToGroup)
    .catch(this.handleError);
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

  createGroup(newGroup): Promise<string> {
    return this.loginService.secureApiPost("https://api.thealfredbutler.com/group/create", JSON.stringify(newGroup))
    .then((res) => {
      console.log(res);
			if (res.json()['status'] == 'success') {
        ons.notification.toast("Group Created!", {
          timeout: 3000,
          modifier: "green"
        });
        this.changeGroup.next(true);
        return res.json()['groupId'];
      } else if (res.json()['status'] == 'name taken') {
        ons.notification.toast("Name Taken!", {
          timeout: 3000,
          modifier: "red"
        });
        this.changeGroup.next(false);
        return "name taken";
			} else if (res.json()['status'] == 'error') {
        ons.notification.toast("An error occurred!", {
          timeout: 3000,
          modifier: "red"
        });
        this.changeGroup.next(false);
        return null;
			}	
		});
  }

  joinGroup(newGroup): Promise<number> {
    return this.loginService.secureApiPost("https://api.thealfredbutler.com/membership/create", JSON.stringify(newGroup))
    .then(res => {
      if (res.json()['status'] == 'success') {
        ons.notification.toast("Joined Group!", {
          timeout: 3000,
          modifier: "green"
        });
        this.changeGroup.next(true);
        return res.json()['groupId'];
      } else if (res.json()['status'] == 'incorrect password') {
        ons.notification.toast("Incorrect Password!", {
          timeout: 3000,
          modifier: "red"
        })
        this.changeGroup.next(false);
        return -1;
			} else if (res.json()['status'] == 'error') {
        ons.notification.toast("An error occurred!", {
          timeout: 3000,
          modifier: "red"
        });
        this.changeGroup.next(false);
        return null;
			}	
    })
  }

  leaveGroup(group): Promise<boolean> {
    return this.loginService.secureApiPost("https://api.thealfredbutler.com/membership/delete", JSON.stringify(group))
    .then(res => {
      if (res.json()['status'] == 'success') {
        ons.notification.toast("Left Group!", {
          timeout: 3000,
          modifier: "red"
        });
        this.changeGroup.next(true);
        return true;
      } else if (res.json()['status'] == 'error') {
        ons.notification.toast("An error occurred!", {
          timeout: 3000,
          modifier: "red"
        });
        this.changeGroup.next(false);
        return false;
      }
    })
  }

  getCurrentGroupObservable(): Observable<Object> {
    return this.currentGroup.asObservable();
  }

  getChangeGroupObservable(): Observable<boolean> {
    return this.changeGroup.asObservable();
  }

  // newGroup = {groupName, routerLink}
  updateCurrentGroup(newGroup) {
    this.currentGroup.next(newGroup);
  }

  private deserialiseJSONToGroup(json): Group {
    let groupArray = json.json()['group'];
    let group = Group.deserialiseJson(groupArray);
		console.log(group);
		return group;
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