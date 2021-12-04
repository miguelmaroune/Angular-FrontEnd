import { Component, OnInit } from '@angular/core';
// import { OktaAuthStateService } from '@okta/okta-angular';
import myAppConfig from 'src/app/config/my-app-config';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  oktaSignIn : any ;

  constructor(//private oktaAuthService :OktaAuthStateService
     ) { 
    this.oktaSignIn = new this.oktaSignIn({
      logo : 'assets/images/logo.png',
      baseUrl : myAppConfig.oidc.issuer.split('oauth2')[0],
      cientId : myAppConfig.oidc.clientId,
      redirectUri : myAppConfig.oidc.redirectUri,
      authParams : {
        pkce :true,
        issuer : myAppConfig.oidc.issuer,
        scopes : myAppConfig.oidc.scopse
      }
    });
  }

  ngOnInit(): void {
    this.oktaSignIn.remove();

    // this.oktaSignIn.renderEl({
    //   el : 'okta-sign-in-widget'},//this name should be same as div tag id in login.component.html 
      // (response) => 
      // {
      //   if(response.status === 'SUCCESS')
      //   {
      //       this.oktaAuthService.signInWithRedirect();
      //   }
      // }
      // );
  }

}
