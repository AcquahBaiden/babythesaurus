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
//toggles view and gets word definition from api
  clickEvent(){
    if(this.wordGroup){
      this.status = !this.status;
      this.loading = false;
    }else{
      this.sub =  this.appService.getWordFromAPI(this.word);
      this.sub.subscribe(data=>{
        this.wordGroup = data;
        this.meanings = data[0].meanings;
        this.similarWords = this.getSimilarWords(data);
        this.loading = false;
        this.status = true
      })

    }
  }

  // retrieves similar words from dictionary api response
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
