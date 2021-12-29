import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-all-words',
  template: `<app-loading *ngIf="loading"></app-loading>
  <div class="main" *ngIf="!loading" style="padding-top: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;">
    <h1 style="text-align: center;">All baby words</h1>

    <input type="text" placeholder="Search..." [(ngModel)]="searchText" style="max-width: 400px; margin: 10px auto; padding: auto 40px;">
    <div *ngFor="let word of words | wordsFilter: searchText;" >
    <app-word word = "{{word}}"></app-word>
    </div>
  </div>`,

})
export class AllWordsComponent implements OnInit {
  words:[string];
  loading:boolean = false;
  searchText:string;
  constructor(private appService:AppService) { }

  ngOnInit(): void {
    this.loading = true;
    this.getAllWords();
  }

  async getAllWords(){
    (await this.appService.getWords()).subscribe(words=>{
      this.words = <[string]>Object.values(words);
      this.words.sort();
      this.loading = false;
    })
  }

}
