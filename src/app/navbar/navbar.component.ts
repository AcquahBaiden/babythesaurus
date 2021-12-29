import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-navbar',
  template: `
  <div class="toolbar" role="banner">
  <span> <a href="home" style="text-decoration: none; color: #fff;">Baby Thesaurus</a> </span>
    <div class="spacer"></div>
    <ul id="menu">
      <a href="home" routerLinkActive="active-link"><li [routerLink]="['home']">Home</li></a>
      <a href="words" routerLinkActive="active-link"><li [routerLink]="['words']">All words</li></a>
      <a href="submit" routerLinkActive="active-link"><li [routerLink]="['submit']">Submit</li></a>
      <a href="login" routerLinkActive="active-link" *ngIf="!isLoggedIn"><li [routerLink]="['login']">Log in</li></a>
      <a href="account" routerLinkActive="active-link" *ngIf="isLoggedIn"><li [routerLink]="['account']">Account</li></a>
    </ul>
</div>`,
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
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

}
