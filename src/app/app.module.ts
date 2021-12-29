import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NavbarMobileComponent } from './navbar-mobile/navbar-mobile.component';
import { AllWordsComponent } from './all-words/all-words.component';
import { LoginComponent } from './login/login.component';
import { SubmitComponent } from './submit/submit.component';
import { HomeComponent } from './home/home.component';
import { LoadingComponent } from './loading/loading.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WordComponent } from './word/word.component';
import { WordsFilter } from './wordsFilter.pipe';
import { environment } from 'src/environments/environment.prod';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    NavbarMobileComponent,
    AllWordsComponent,
    LoginComponent,
    SubmitComponent,
    HomeComponent,
    LoadingComponent,
    WordComponent,
    WordsFilter,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAnalyticsModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
