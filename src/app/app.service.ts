import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  public user: Observable<any>

  constructor(private http:HttpClient,
    private auth:AngularFireAuth, private database: AngularFireDatabase) {
      this.user = auth.authState.pipe(map((user: any)=>{
        if(!user){
          return null
        }else{
          return user
        }
      }))
    }

 async getWords(){
  return this.http.request('GET','https://babythesaurus-4a326-default-rtdb.firebaseio.com/allWords.json')
  }


  getWordFromAPI(word:string){
    return this.http.request('GET',`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`, {responseType:'json'})
  }

  createAccount(email:string,password:string){
    return this.auth.createUserWithEmailAndPassword(email,password).then(user=>{
      return user
    }).catch(error=>{
      return error
    })
  }

  public isLoggedIn(){
    return this.auth.user
  }

  login(email:string,password:string){
    return this.auth.signInWithEmailAndPassword(email,password).then(user=>{
      return user
    }).catch(error=>{
      return error
    })
  }

  saveWord(userId:string,word:string){
    const pushId = this.database.createPushId();
    return this.database.object(`users/${userId}/savedWords/${pushId}/`).set(word)
  }

}
