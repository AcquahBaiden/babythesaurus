import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-navbar-mobile',
  templateUrl: './navbar-mobile.component.html',
  styleUrls: ['./navbar-mobile.component.css']
})
export class NavbarMobileComponent implements OnInit {
  isLoggedIn:boolean = false;
  constructor(private appService:AppService) { }

  ngOnInit(): void {
    this.appService.user.subscribe(response=>{
      if(response){
        this.isLoggedIn = true;
      }else{
        this.isLoggedIn = false;
      }
    })
  }
  logout(){
    this.appService.logout();
  }
}
