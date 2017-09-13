import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Group } from './group';
import { User } from './user';
import { MOCK_GROUPS } from './mock-groups';

@Injectable()
export class GroupService {

  constructor(private http: Http) { }

  getAllGroups(): Promise<Group[]> {
    return Promise.resolve(MOCK_GROUPS);
  }

  getGroupsByUserId(userId): Promise<Group[]> {
    return Promise.resolve(MOCK_GROUPS.filter(group => {
      return this.isInGroup(group, userId);
    }));
  }

  getGroupsByUserIdSlowly(userId): Promise<Group[]> {
      return new Promise(resolve => {
          // Simulate server latency with 1 second delay
          setTimeout(() => resolve(this.getGroupsByUserId(userId)), 2000);
      });
  }

  getGroupById(groupId): Promise<Group> {
    return Promise.resolve(MOCK_GROUPS.find(group => {
      return group.id == groupId;
    }))
  }

  getGroupByIdSlowly(groupId): Promise<Group> {
    return new Promise(resolve => {
        // Simulate server latency with 1 second delay
        setTimeout(() => resolve(this.getGroupById(groupId)), 2000);
    });
  }

  isInGroup(group: Group, userId): boolean {
    if (group.owner == userId) {
      return true;
    }

    for (let member of group.members) {
      if (member.id == userId) {
        return true;
      }
    }

    return false;
  }
}