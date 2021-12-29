import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppService } from '../app.service';
import { Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit,OnDestroy {
  word:string;
  words:any;
  loading = true;
  wordGroup:any;
  similarWords:any;
  sub:any;
  constructor(private http:HttpClient,
    private appService: AppService) { }

  async ngOnInit(): Promise<void> {
     this.onGenerateWord();

  }

  async getWordsFromFirebase(){
     (await this.appService.getWords()).subscribe(data=>{
      return Object.values(data);
    });
  }


getWordGroup(word:string){
  this.sub = this.appService.getWordFromAPI(word)
  this.sub.subscribe(data=>{
    this.wordGroup = data[0];
    this.similarWords = this.getSimilarWords(data)
    data?this.loading = false : '';
    console.log(this.wordGroup);
  });
}

  async onGenerateWord(){
    console.log('this.words:',!!this.words);
    this.loading = true;
    if(this.words !== undefined){
      console.log('inside 1');
      if(this.words.length === 0){
        (await this.appService.getWords()).subscribe(data=>{
          this.words= Object.values(data);
          console.log('this.words:',this.words);
          this.word = this.words[Math.floor(Math.random()*this.words.length)];
          this.words = this.words.filter((value)=>{
            return value !== this.word
          })
          this.getWordGroup(this.word)
        })
      }else{
        this.word = this.words[Math.floor(Math.random()*this.words.length)];
          this.words = this.words.filter((value)=>{
            return value !== this.word
          })
          this.getWordGroup(this.word);
      }

    }else{
      console.log('inside 2');
      (await this.appService.getWords()).subscribe(data=>{
        this.words= Object.values(data);
        console.log('this.words:',this.words);
        this.word = this.words[Math.floor(Math.random()*this.words.length)];
        this.words = this.words.filter((value)=>{
          return value !== this.word
        })
        this.getWordGroup(this.word)
      })
    }
    console.log('inside 3');


  }

  getSimilarWords(data:any){
  const all = data[0].meanings[0].definitions[0].synonyms
  return all.slice(0, 3)
  }

  saveWord(){
    this.appService.user.pipe(take(1),map((user)=>{
      if(!user){
        alert('Log in to save word');
        return
      }
      this.appService.saveWord(user.uid,this.word).then(()=>{
        alert('Word successfully saved')
      }).catch((error)=>{
        alert('Something went wrong. Word was not saved')
      })
    }))
  }

  playAudio(link:string){
    let audio = new Audio();
    console.log('link:',link);
    audio.src = link;
    audio.load();
    audio.play()
  }

  ngOnDestroy(){
    if(this.sub){
      this.sub.unsubscribe()
    }
  }
}
