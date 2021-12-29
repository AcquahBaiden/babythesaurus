import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { AppService } from '../app.service';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.css']
})
export class WordComponent implements OnInit, OnDestroy {
  @Input() word:string;
  status:boolean = false;
  loading:boolean = true;
  wordGroup:any;
  meanings:any;
  sub:any;
  similarWords:any;
  constructor(private appService:AppService) { }

  ngOnInit(): void {

  }

  clickEvent(){
    console.log('clicked');
    console.log('this.wordGroup:',this.wordGroup);
    console.log('this.word:',this.word);
    if(this.wordGroup){
      this.status = !this.status;
      console.log('status:',this.status);
      this.loading = false;
    }else{
      console.log('second');
      this.sub =  this.appService.getWordFromAPI(this.word);
      this.sub.subscribe(data=>{
        this.wordGroup = data;
        console.log('data:',data);
        console.log('this.wordGroup:',this.wordGroup);
        this.meanings = data[0].meanings;
        this.similarWords = this.getSimilarWords(data);
        console.log('this.similarwords:',this.similarWords);
        this.loading = false;
        this.status = true
      })

    }
  }

getSimilarWords(data:any){
  const all = data[0].meanings[0].definitions[0].synonyms
  return all.slice(0, 3)
  }
ngOnDestroy(): void {
  if(this.sub){
    this.sub.unsubscribe()
  }
}
}
