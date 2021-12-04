import { Component, OnInit } from '@angular/core';
// import { OktaAuthStateService } from '@okta/okta-angular';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated : boolean = false ;
  userFullName : string;
  constructor(//private oktaAuthService : OktaAuthStateService
    ) { }

  ngOnInit(): void {
    //Subscribe to authentication state changes 
    // this.oktaAuthService.$authenticationState.subscribe(

    //   (result) => {
    //     this.isAuthenticated = result;
    //     this.getUserDetails();

    //   }
    // );
  }
  getUserDetails() {
    if(this.isAuthenticated)
    {
      //Fetch the logged in user details (user's claims)
    
      // this.oktaAuthService.getUser().then(
      //   res => 
      //   {
      //     this.userFullName = res.name;
      //   }
      // );
    }
 

  
  }

  logout()
  {
    //Terminated the session with Okta and removes current tokens.
    
    // this.oktaAuthService.signOut();

  }
}

