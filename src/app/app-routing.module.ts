import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllWordsComponent } from './all-words/all-words.component';
import { HomeComponent } from './home/home.component';
import { LoadingComponent } from './loading/loading.component';
import { LoginComponent } from './login/login.component';
import { SubmitComponent } from './submit/submit.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', component: HomeComponent},
  {path: 'words', component: AllWordsComponent},
  {path: 'login',  component: LoginComponent},
  {path: 'submit', component: SubmitComponent},
  {path: 'loading', component: LoadingComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
