import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit {
  isError:boolean = false;
  errorMessage:string;
  minDate: Date = new Date (1920, 1, 1);
  maxDate: Date = new Date (2009, 12, 31);
  constructor(private appService:AppService,private router:Router) { }

  ngOnInit(): void {
  }
  //handles user information and submits to send to firebase database
  onSubmit(f:NgForm){
    if(!f.valid){
      return
    }

    this.appService.savePersonalInfo(f.value)
    .then(()=>this.appService.updatedisplayName(f.value.firstName,f.value.lastName))
    .then(()=>this.router.navigate(['account']))
    .catch(()=>{
      this.isError = true;
      this.errorMessage = 'Something went wrong. Please try again'
    })
  }
}
