import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from '../app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loading:boolean= false;
  isLogin:boolean = true;
  isLoginError:boolean = false;
  errorMessage = 'No email found with the record. Please sign up';
  //deplate driven form for login. Use dynamic form if you demand more control for the process.
  // Check submitComponent form as example
  loginForm = this.formBuilder.group({
    email: '',
    password: ''
  });

  constructor(private formBuilder: FormBuilder,
    private appService:AppService,
    private router:Router) { }
  ngOnInit(): void {
  }

  //handles user login and signup.
  // can be split into two if you require more for a signup process
  onSubmit(isLogin:boolean){
    if(!this.loginForm.value.email){
      return
    }
    if(!this.loginForm.value.password){
      return
    }

    if(isLogin){
      this.appService.login(this.loginForm.value.email,this.loginForm.value.password).then(user=>{
        this.loading = true;
        this.router.navigate(['account']);
      }).catch(error=>{
        this.isLoginError = true;
      switch(error.code){
        case 'auth/user-not-found':
          this.errorMessage = 'Email address not registered to an account. Please sign up';
          break;
        case 'auth/wrong-password':
          this.errorMessage = 'Incorrect password. Please try again!';
          break;
        case 'auth/network-request-failed':
          this.errorMessage = 'A network error occured. Please check your internet and try again';
          break;
        default:
          this.errorMessage = 'Something went wrong. Please try again later';
      }
      })
    }else{
      this.appService.createAccount(this.loginForm.value.email,this.loginForm.value.password).then(user=>{
        this.router.navigate(['account']);
      }).catch(error=>{
        this.isLoginError = true;
        switch(error.code){
          case 'auth/user-not-found':
            this.errorMessage = 'Email address not registered to an account. Please sign up';
            break;
          case 'auth/wrong-password':
            this.errorMessage = 'Incorrect password. Please try again!';
            break;
          case 'auth/network-request-failed':
            this.errorMessage = 'A network error occured. Please check your internet and try again';
            break;
          default:
            this.errorMessage = 'Something went wrong. Please try again later';
        }
      })
    }
  }


toggleForm(type:string){
  type==='login'?this.isLogin = true: this.isLogin = false;
}

}
