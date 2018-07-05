import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router }      from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

   message: string;
 
  constructor(public authService: AuthService, public router: Router) {
    this.setMessage();
  }

  ngOnInit() {
  }
 
  setMessage() {
    this.message = 'Logged ' + (this.authService.isLoggedIn ? 'in' : 'out');
  }
 
  login() {
    this.message = 'Trying to log in ...';
 
    this.authService.login().subscribe(() => {
      this.setMessage();
      if (this.authService.isLoggedIn) {
        // Get the redirect URL from our auth service
        // If no redirect has been set, use the default
        let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '/admin';
 
        // Redirect the user
        this.router.navigate([redirect]);
      }
    });
  }
 
  logout() {
    this.authService.logout();
    this.setMessage();
  }


  /*
  loginUserData = {}

  constructor(private _authService: AuthService) { }

  

  loginUser() {
  	console.log(this.loginUserData)
  	this._authService.loginUser(this.loginUserData)
  		.subscribe(
  			res => {
  				if (res.status == 'loggedin') {
  					console.log('login success')
  				} else {
  					alert('invalid login');
  					console.log('login failed')
  				}
  			},
  			err => console.log(err)
  		)
  }
  */
}
