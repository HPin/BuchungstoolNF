import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginUserData = {}

  constructor(private _authService: AuthService) { }

  ngOnInit() {
  }

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

}
