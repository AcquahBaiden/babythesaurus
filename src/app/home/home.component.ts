import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  word:{word:string;userName:string};
  words:any;
  loading = true;
  wordGroup:any;
  similarWords:any;
  sub:Observable<any>;
  user:User;
  userId:string;

  active:boolean = false;
  message:string;
  isSuccess:boolean=true;
  constructor(private appService: AppService,private router:Router) { }

  async ngOnInit(): Promise<void> {
     this.onGenerateWord();
     this.appService.user.subscribe(user=>{
       if(user){
        this.user = user;
        this.userId = user.uid;
       }
     })
     console.log(`
      Welcome 🎊 🎉 to the baby thesaurus. We hope you enjoy using this. Find the source code at
      https://github.com/AcquahBaiden/babythesaurus
     `)
  }


getWordGroup(word:string){//connects gets word from dictionary api
  this.sub = this.appService.getWordFromAPI(word)
  this.sub.subscribe(data=>{
    this.wordGroup = data[0];
    this.similarWords = this.getSimilarWords(data)
    data?this.loading = false : '';
  });
}

  async onGenerateWord(){//gets list of words from backend and randomly selects a word
    this.loading = true;
    if(this.words !== undefined){
      if(this.words.length === 0){
        (await this.appService.getWords()).subscribe(data=>{
          this.words= Object.values(data);
          this.word = this.words[Math.floor(Math.random()*this.words.length)];
          this.removeWordFromArray(this.word.word);
          this.getWordGroup(this.word.word);
        })
      }else{
        this.word = this.words[Math.floor(Math.random()*this.words.length)];
        this.removeWordFromArray(this.word.word);
        this.getWordGroup(this.word.word)
      }

    }else{
      (await this.appService.getWords()).subscribe(data=>{
        this.words= Object.values(data);
        this.word = this.words[Math.floor(Math.random()*this.words.length)];
        this.removeWordFromArray(this.word.word);
        this.getWordGroup(this.word.word);
      })
    }
  }

  removeWordFromArray(word:string){//removes shown word from lists of words
    this.words = this.words.filter((value:{word:string,userName:string})=>{
      return value.word !== this.word.word;
    })
  }

  getSimilarWords(data:any){//retrieves similar word lists from dictionary api object
  const all = data[0].meanings[0].definitions[0].synonyms
  return all.slice(0, 3)
  }

  saveWord(){//saves word to user's account
    if(!this.user){
      this.router.navigate(['login'])
    }
    this.appService.saveWord(this.userId,this.word.word).then(()=>{
      this.showToast(`${this.word.word} is successfully saved to your account`,true);
    }).catch((error)=>{
      this.showToast(`Something went wrong. Submitting ${this.word.word} is unsuccessful`,false);
    })
  }

  playAudio(link:string){//plays audio
    let audio = new Audio();
    audio.src = link;
    audio.load();
    audio.play()
  }

  showToast(message:string,isSuccess:boolean){//shows toast message
    this.active = true;
    this.isSuccess = isSuccess;
    this.message = message;
    setTimeout(()=>{
      this.active = false;
      this.isSuccess = true;
    },3000)
  }

}
