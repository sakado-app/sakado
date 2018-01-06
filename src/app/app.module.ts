import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { SakadoApp } from './app.component';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push } from "@ionic-native/push";
import { LoginPage } from "../pages/login/login";
import { AuthService } from "./auth.service";
import { PronoteService } from "./pronote.service";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [
    SakadoApp,
    ListPage,
    LoginPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,

    IonicModule.forRoot(SakadoApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    SakadoApp,
    ListPage,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Push,
    AuthService,
    PronoteService,

    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule
{
}
