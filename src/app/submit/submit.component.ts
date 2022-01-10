import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppService } from '../app.service';

@Component({
  selector: 'app-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.css']
})
export class SubmitComponent implements OnInit {
  submitForm = this.formBuilder.group({
    word:'',
    example:'',
  });
    active:boolean = false;
   message:string;
   isSuccess:boolean=true;
   userId:string;
   userName:string;

   submitAnonymous:boolean = false;

   errorMessage:string;
   wordError:boolean = false;
  constructor(private formBuilder:FormBuilder,
    private appService:AppService, ) { }

  ngOnInit(): void {
    this.appService.user.subscribe(user=>{
      if(user){
        this.userName = user.displayName;
        this.userId = user.uid
      }
    })
  }

  async onSubmitWord(){
    if(!this.submitForm.value.word){
      return
    }
    if(!this.submitForm.value.example){
      return
    }
    //check if word has already been submited and raise error
   (await this.appService.getWords()).subscribe(data=>{
     const allWords = Object.values(data);
    if(allWords.includes(this.submitForm.value.word)){
      this.wordError = true;
      this.errorMessage = `${this.submitForm.value.word} is already in the thesaurus. Submit another word`;
    }else{
      //else continue to submit
      this.submitWord();
    }
   })
  }

  submitWord(){
      const submittedWord = this.submitForm.value;
      if(this.userId){
        this.submitAnonymous? submittedWord.userName = 'Anonymous': submittedWord.userName = this.userName ;
        submittedWord.userId = this.userId;
      }else{
        submittedWord.userName = 'Anonymous';
        submittedWord.userId = 'Anonymous'
      }

      submittedWord.isApproved = false;
      this.appService.submitWord(this.submitForm.value, this.userId?this.userId:'anonymous')
      .then(()=>{
        this.showToast(`${this.submitForm.value.word} was successfully submitted`,true);
        this.submitForm.reset();
      }).catch(()=>{
        this.showToast(`Something went wrong. Submitting ${this.submitForm.value.word} is unsuccessful`,false);
      });

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

  toggleAnonymous(){
    this.submitAnonymous = !this.submitAnonymous
  }

}
