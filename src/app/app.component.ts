import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ListPage } from '../pages/list/list';
import { Push, PushObject, PushOptions } from "@ionic-native/push";
import { AuthService } from "./auth.service";
import { LoginPage } from "../pages/login/login";

@Component({
  templateUrl: 'app.html'
})
export class SakadoApp implements OnInit
{
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public push: Push, public alertCtrl: AlertController, public auth: AuthService)
  {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      // { title: 'Profs. absents', component: HomePage },
      { title: 'Se déconnecter', component: ListPage }
    ];

  }

  ngOnInit()
  {
    /*if (!this.auth.logged)
    {
      this.nav.setRoot(LoginPage);
    }*/
  }

  initializeApp()
  {
    this.platform.ready().then(() =>
    {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      if (!this.platform.is('cordova'))
      {
        console.warn('Push notifications disabled - Not on physical device');
        return;
      }

      const options: PushOptions = {
        android: {
          senderID: '332651966157'
        },
        ios: {
          alert: 'true',
          badge: false,
          sound: 'true'
        },
        windows: {}
      };

      const pushObject: PushObject = this.push.init(options);

      pushObject.on('registration').subscribe(data =>
      {
        console.log(`device token -> ${data.registrationId}`);
        this.auth.deviceToken = data.registrationId;
      });

      pushObject.on('notification').subscribe(data =>
      {
        console.log(`message -> ${data.message}`);

        if (data.additionalData.foreground)
        {
          let confirmAlert = this.alertCtrl.create({
            title: 'New Notification',
            message: data.message,
            buttons: [
              {
                text: 'Ignore',
                role: 'cancel'
              },
              {
                text: 'View',
                handler: () =>
                {
                  console.log(`azErkzpoeroaerpazjeor message : ${data.message}`);
                }
              }
            ]
          });
          confirmAlert.present();
        } else
        {
          console.log(`Euh c'est cliqué je crois ??`);
        }
      });


      pushObject.on('error').subscribe(error =>
      {
        console.error(`Oupsi doupsi : ${error}`);
      })
    });
  }

  openPage(page)
  {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
