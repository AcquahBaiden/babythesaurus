import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { User } from './interfaces/user.interface';
import { SubmittedWord } from './interfaces/submittedWord.interface';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  public user: Observable<any>

  constructor(private http:HttpClient,
    private auth:AngularFireAuth, private database: AngularFireDatabase) {
      this.user = auth.authState.pipe(map((user: any)=>{//sets a fireabse user object
        if(!user){
          return null
        }else{
          return user
        }
      }))
    }

    //Gets your lists of words from firebase project.
 async getWords(){
  return this.http.request('GET','https://babythesaurus-4a326-default-rtdb.firebaseio.com/words.json')
  }


  // gets word definition and example from dictionary api
  getWordFromAPI(word:string){
    return this.http.request('GET',`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`, {responseType:'json'})
  }

  //creates a firebase user account.
  // Decided to use SDK but you can create an auth object and connect to your project api instead as done with getWords()
  createAccount(email:string,password:string){
    return this.auth.createUserWithEmailAndPassword(email,password)
  }

  login(email:string,password:string){
    return this.auth.signInWithEmailAndPassword(email,password)
  }

  //saves user information to firebase database
  async savePersonalInfo(data:{firstName:string,lastName:string, dob?:Date}){
    const userId =  (await this.auth.currentUser).uid;
    return this.database.object(`users/${userId}/bio`).set(data);
  }
  //updates firebase auth object displayName
  updatedisplayName(firstName:string, lastName:string){
    return this.auth.currentUser.then(user=>{
      user.updateProfile({
        'displayName' :`${firstName} ${lastName}`
      })
    })
  }

  // public isLoggedIn(){
  //   return this.auth.user
  // }

  logout(){
    this.auth.signOut();
  }

  //saves user's saved word to firebase database
  saveWord(userId:string,word:string){
    const pushId = this.database.createPushId();
    return this.database.object(`users/${userId}/savedWords/${pushId}/`).set(word)
  }

  //gets the users data from database
  async getUserData(uid:string){
    return this.database.object(`users/${uid}/`).valueChanges().pipe(
      map((userData:User)=>{
        return userData;
      })
    )
  }

  //accepts submitted word and update updates database trees
  async acceptWord(pushId:string,word:SubmittedWord){
    const submittedWord =Object.assign({},word);
    const publicWord = {
      'word':word.word,
      'userName':word.userName
    }
    const updates = [];
    updates.push(this.database.object(`words/${pushId}/`).set(publicWord));

    if(submittedWord.userId !== 'Anonymous'){
      updates.push(this.database.object(`submittedWords/${pushId}`).remove());
      updates.push(this.database.object(`users/${submittedWord.userId}/submittedWords/${pushId}/isApproved/`).set(true));
      updates.push(this.database.object(`users/${submittedWord.userId}/messages/${pushId}/`).set(`Hurrraaaay 🎉 🎊 🍾 ! Your word "${word.word}" has been approved. Go find it in the baby thesaurus`));
    }else{
      updates.push(this.database.object(`submittedWords/${pushId}`).remove())
    }
    return Promise.all(updates)
  }
//rejects submitted word and update updates database trees
  async rejectWord(pushId:string,submittedWord:SubmittedWord){
    const updates = [];
    if(submittedWord.userId !== 'Anonymous'){
      updates.push(this.database.object(`users/${submittedWord.userId}/submittedWords/${pushId}/isApproved/`).set(false));
      updates.push(this.database.object(`users/${submittedWord.userId}/submittedWords/${pushId}/isRejected/`).set(true));
      updates.push(this.database.object(`submittedWords/${pushId}`).remove());
      updates.push(this.database.object(`users/${submittedWord.userId}/messages/${pushId}/`).set(`Sorry your word "${submittedWord.word}" was not approved for baby thesaurus.`));
    }else{
      updates.push(this.database.object(`submittedWords/${pushId}`).remove());
    }

    return Promise.all(updates)
  }

  // submits a word to the firebase database
  submitWord(values:SubmittedWord,userId:string){
    const pushId = this.database.createPushId();
    const updates = [];
    updates.push(this.database.object(`submittedWords/${pushId}/`).set(values));
    updates.push(this.database.object(`users/${userId}/submittedWords/${pushId}/`).set(values));
    return Promise.all(updates);
  }

  // retrieves submitted words from firebase
  getSubmittedWords(){
    return this.database.object('submittedWords').valueChanges();
  }

}
