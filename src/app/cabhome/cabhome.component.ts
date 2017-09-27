import { Component, OnInit, ViewChild } from '@angular/core';
import { LoginService } from '../login.service';
import { GroupService } from '../group.service';
import { DirectionsService } from '../directions.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { User } from '../user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cabhome',
  templateUrl: './cabhome.component.html',
  styleUrls: ['./cabhome.component.css']
})
export class CabhomeComponent implements OnInit {

  @ViewChild('modal_loading') modalLoading;

  public notAvailable = false;
  public usersInGroup: User[];
  public startingLocation = null;
  public destination = null;
  public waypoints = [];
  public render = false;

  public usersInRoute: User[];
  private currentGroupId = 0;
  private subFetchedDirections: Subscription;

  constructor(
    private loginService: LoginService,
    private groupService: GroupService,
    private directionsService: DirectionsService,
    private route: ActivatedRoute,
    private router: Router,
  ) { 
  }

  ngOnInit() {
    
    this.subFetchedDirections = this.directionsService.getFetchedDirectionsObservable().subscribe(
      fetched => {
        // Hide Loading
        this.modalLoading.nativeElement.hide();
      }
    )

    // Fetch Group Details
    this.waypoints = [];
    this.route.paramMap
    .switchMap((params: ParamMap) => {
      //this.currentGroupId = +params.get('id');
      this.currentGroupId = 2;
      // Authentication
      // return this.groupService.getGroupsOfUser().then(
      //   groups => {
      //     if (this.groupService.isInGroup(groups, this.currentGroupId)) {
      //       return this.groupService.getGroupById(this.currentGroupId);
      //     } else {
      //       // Prevent unauthorized access
      //       console.log("Unauthorized Access");
      //       return null;
      //     }
      //   }
      // )
      return this.groupService.getGroupByIdDebug(this.currentGroupId);
    }).subscribe(
      group => {
        this.usersInGroup = group.members;
        this.usersInRoute = this.usersInGroup.slice();
        this.fetchUserLocation();
      }
    )
  }

  fetchUserLocation() {
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(position => {
        this.startingLocation = position.coords;
        //this.calculateRoute(this.usersInRoute);

        // When Done
        this.render = true;
      });
    }
  }

  calculateRoute(users: User[]) {
    users = users.filter(user => {
      if (user.address) {
        return true;
      } else {
        return false;
      }
    });
    if (users.length == 0) {
      this.notAvailable = true;
      console.log("Not Available");
      return;
    }
    if (users.length == 1) {
      //return this.destination = this.usersInGroup[0].address;
      return this.destination = {
        lat: users[0].latitude,
        lng: users[0].longitude,
      }
    }
    //console.log(users);
    // Sort by shortest distance to next
    var currentOrigin = new User(0, 0, "", "", null, null, 
      this.startingLocation.latitude, this.startingLocation.longitude);
    var membersLeft = users.slice();

    for (var _i=0; _i<users.length; _i++) {
      if (membersLeft.length == 1) {
        //this.destination = membersLeft[0].address;
        this.destination = {
          lat: membersLeft[0].latitude,
          lng: membersLeft[0].longitude,
        }
      } else {
        var nextMember = membersLeft[0];
        var shortestDistance = this.getDistance(currentOrigin, nextMember);
        for (let member of membersLeft) {
          if (this.getDistance(currentOrigin, member) < shortestDistance) {
            nextMember = member;
            shortestDistance = this.getDistance(currentOrigin, nextMember);
          }
        }
        this.waypoints.push({
          location: {
            lat: nextMember.latitude,
            lng: nextMember.longitude,
          }
        });
        membersLeft = membersLeft.filter(member => {
          return member != nextMember;
        })
      }
    }

    // console.log(this.startingLocation);
    // console.log(this.waypoints);
    // console.log(this.destination);

    // Engage Loading
    this.modalLoading.nativeElement.show();

    this.directionsService.getNewDirections({
      origin: this.startingLocation, 
      destination: this.destination,
      waypoints: this.waypoints,
    });
  }

  getDistance(x: User, y: User): number {
    return Math.sqrt(Math.pow(x.latitude - y.latitude, 2) 
    + Math.pow(x.longitude - y.longitude, 2))
  }

  toggleUser(togglingUser: User) {
    var isUserInRoute = false;
    for (let member of this.usersInRoute) {
      if (member.userId == togglingUser.userId) {
        isUserInRoute = true;
        break;
      }
    }
    if (isUserInRoute) {
      this.usersInRoute = this.usersInRoute.filter(user => {
        if (user.userId == togglingUser.userId) {
          return false;
        } else {
          return true;
        }
      })
    } else {
      this.usersInRoute.push(togglingUser);
    }

    // console.log(this.usersInRoute);
  }

  recalculate() {
    // Recalculate
    this.waypoints = [];
    this.destination = null;
    this.calculateRoute(this.usersInRoute);
  }
}
