import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { AppService } from '../app.service';
import { SubmittedWord } from '../interfaces/submittedWord.interface';
import { User } from '../interfaces/user.interface';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  userIsSuper:boolean = false;
  loading:boolean = false;
  user:User;
  firbaseUser:Observable<any>
  userId:string;
  pendingWords:SubmittedWord[];

  active:boolean = false;
   message:string;
   isSuccess:boolean=true;
  constructor(private appService:AppService,
    private router:Router) {}

  ngOnInit(): void {
    this.loading = true;
    this.appService.user.subscribe((user)=>{//checks if user is logged in
      if(!user){
        this.router.navigate(['login']);
      }else{
        this.firbaseUser = user;
        this.userId = user.uid;
        this.setUserData()
      }
    })
  }

  // retrieve and assigns user data to properties
  setUserData(){
    this.appService.getUserData(this.userId)
    .then((data:Observable<User>)=>{
      data.subscribe((userData:User)=>{
        if(userData === null) return this.router.navigate(['login/setup']);
        this.user = userData;
        if(!!userData.bio.isSuper){
          this.userIsSuper = true;
          this.getSubmitedWords();
        }else{
          this.userIsSuper = false;
        }
        this.loading = false;
      })
    })
  }

  //retrieves user submitted words
  getSubmitedWords(){
    this.appService.getSubmittedWords().subscribe((words:SubmittedWord[])=>{
        this.pendingWords = words;
    })
  }

//accepts user submitted word
  onAcceptWord(pushId:string,word:SubmittedWord){
    this.appService.acceptWord(pushId,word).then(()=>{
      this.showToast(`${word.word} successfully approved`,true);
    }).catch((error)=>{
      this.showToast(`Something went wrong, ${word} was not approved`,false);
    })
  }

  //rejects user submitted word
  onrejectWord(pushId:string,word:SubmittedWord){
    this.appService.rejectWord(pushId,word).then(()=>{
      this.showToast(`${word.word} successfully rejected`,true);
    }).catch((error)=>{
      this.showToast(`Something went wrong, ${word} was not rejected`,false);
    })
  }


  showToast(message:string,isSuccess:boolean){
    this.active = true;
    this.isSuccess = isSuccess;
    this.message = message;
    setTimeout(()=>{
      this.active = false;
      this.isSuccess = true;
    },3000)
  }

}
