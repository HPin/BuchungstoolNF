import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  name = "User";

  constructor(private authService: AuthService) { }

  ngOnInit() {
  	console.log(this.authService.getName())
  	this.name = this.authService.getName();
  }

}
