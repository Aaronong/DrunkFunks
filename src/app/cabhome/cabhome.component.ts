import { Component, OnInit, ViewChild } from '@angular/core';
import { LoginService } from '../login.service';
import { GroupService } from '../group.service';
import { DirectionsService } from '../directions.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { User } from '../user';
import { GoogleMapsAPIWrapper } from '@agm/core';
import { Subscription } from 'rxjs';

declare var google;

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
  public uberTime = -1;

  public addr;
  public usersInRoute: User[];
  private currentGroupId = 0;
  private subFetchedDirections: Subscription;
  private subGeoCoderReady: Subscription;
  private subLogin: Subscription;

  constructor(
    private loginService: LoginService,
    private groupService: GroupService,
    private directionsService: DirectionsService,
    private gmapsApi: GoogleMapsAPIWrapper,
    private route: ActivatedRoute,
    private router: Router,
  ) { 
  }

  ngOnInit() {
    // Listen for logout
    this.subLogin = this.loginService.getLoggedInObservable().subscribe(
      isLoggedIn => {
        if (!isLoggedIn) {
          this.router.navigate(['/login']);
        }
      }
    )

    // Check if user is logged in
    if (!this.loginService.getProfile()) {
      this.router.navigate(['/login']);
      return;
    }

    this.subFetchedDirections = this.directionsService.getFetchedDirectionsObservable().subscribe(
      fetched => {
        // Hide Loading
        this.modalLoading.nativeElement.hide();
      }
    )

    this.subGeoCoderReady = this.directionsService.getGeoCoderObservable().subscribe(
      response => {
        if (response == '_ready') {
          this.directionsService.reverseGeoCode(
            {
              lat: this.startingLocation.latitude, 
              lng: this.startingLocation.longitude
            }
          )
        } else {
          this.addr = response;
        }
        
      }
    )

    // Fetch Group Details
    this.waypoints = [];
    this.route.paramMap
    .switchMap((params: ParamMap) => {
      this.currentGroupId = +params.get('id');
      // Authentication
      return this.groupService.getGroupsOfUser().then(
        groups => {
          if (this.groupService.isInGroup(groups, this.currentGroupId)) {
            return this.groupService.getGroupById(this.currentGroupId);
          } else {
            // Prevent unauthorized access
            console.log("Unauthorized Access");
            this.router.navigate(['/404']);
            return;
          }
        }
      )
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
        this.directionsService.getUberTiming(position.coords.latitude, position.coords.longitude).then(
          time => {
            if (time > 0) {
              this.uberTime = time;
            }
          });

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

  useUber() {
    window.location.href="https://m.uber.com/ul/?action=setPickup";
  }
}
