import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { AllWordsComponent } from './all-words/all-words.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SetupComponent } from './login/setup/setup.component';
import { SubmitComponent } from './submit/submit.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'words', component: AllWordsComponent},
  {path: 'login',  component: LoginComponent},
  {path: 'login/setup',  component: SetupComponent},
  {path: 'submit', component: SubmitComponent},
  {path: 'account', component: AccountComponent},//auth guard
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
