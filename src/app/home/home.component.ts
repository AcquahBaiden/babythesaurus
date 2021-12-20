import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  word:string;
  words = ['cute','precious','darling','sweet','adorable','big','small','tiny','chubby','lovely','cuddly','squishy']//get from firebase database
  loading = true;
  wordGroup:any;
  similarWords:any;
  constructor(private http:HttpClient) { }

  async ngOnInit(): Promise<void> {

    this.word = this.getNewWord();
    this.words = this.words.filter((value)=>{
      return value !== this.word
    })
    this.getWordFromAPI(this.word).subscribe(data=>{
      this.wordGroup = data[0];
      this.similarWords = this.getSimilarWords(data)
      data?this.loading = false : '';
      console.log(this.wordGroup);
    });

  }

  getWordFromAPI(word:string){
    return this.http.request('GET',`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`, {responseType:'json'})
  }

  onGenerateWord(){
    this.loading = true;
    const newWord = this.getNewWord();
    this.words = this.words.filter((value)=>{
      return value !== newWord
    })
    const newWordGroup = this.getWordFromAPI(newWord);
    newWordGroup.subscribe(data=>{
      console.log('generated data:',data);
      this.wordGroup = data[0];
      this.similarWords = this.getSimilarWords(data);
      console.log('similarWords:',this.similarWords);
      data?this.loading = false : ''
    })
  }

  getNewWord(){//firebase word
    if(this.words.length === 0){
      this.words = ['cuddle','adorable','pretty','beautiful'];
    }
    return this.words[Math.floor(Math.random()*this.words.length)];
  }

  getSimilarWords(data:any){
  const all = data[0].meanings[0].definitions[0].synonyms
  return all.slice(0, 3)
  }

  saveWord(){

  }

  playAudio(link:string){
    let audio = new Audio();
    console.log('link:',link);
    audio.src = link;
    audio.load();
    audio.play()
  }
}
