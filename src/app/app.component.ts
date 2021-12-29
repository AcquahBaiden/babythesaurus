import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'babythesaurus';
  isMobileScreen = false;
  mobileWidth:number = 768;
  first:boolean = true
  ngOnInit(): void {
    window.innerWidth < this.mobileWidth ? this.isMobileScreen = true : this.isMobileScreen = false;

  }
  @HostListener('window:resize', ['$event'])
  onResize(event?){
    event.target.window.innerWidth < this.mobileWidth?console.log(true):console.log(false);
    event.target.window.innerWidth < this.mobileWidth? this.isMobileScreen = true:this.isMobileScreen = false
  }

}
