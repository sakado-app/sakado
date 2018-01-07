/*
 *  Sakado, an app for school
 *  Copyright (c) 2017-2018 Adrien 'Litarvan' Navratil
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import { Component, ViewChild } from '@angular/core';
import { AlertController, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { AuthService } from './auth.service';
import { LoginPage } from '../pages/login/login';
import { NextPage } from '../pages/next/next';
import { AwayPage } from '../pages/away/away';
import { LogoutPage } from '../pages/logout/logout';
import { AboutPage } from '../pages/about/about';

@Component({
    templateUrl: 'app.html'
})
export class SakadoApp
{
    @ViewChild(Nav) nav: Nav;

    rootPage: any;

    pages: Array<{ title: string, component: any, auth?: boolean }>;

    constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public push: Push, public alertCtrl: AlertController, public auth: AuthService)
    {
        this.initializeApp();

        this.rootPage = this.auth.logged ? NextPage : LoginPage;

        this.pages = [
            { title: 'Se connecter', component: LoginPage, auth: false },
            { title: 'Profs absents', component: AwayPage, auth: true },
            { title: 'Prochain cours', component: NextPage, auth: true },
            { title: 'Se deconnecter', component: LogoutPage, auth: true },
            { title: 'A Propos', component: AboutPage }
        ]
    }

    initializeApp()
    {
        this.platform.ready().then(() => {
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

            pushObject.on('registration').subscribe(data => {
                this.auth.deviceToken = data.registrationId;
            });

            pushObject.on('notification').subscribe(data => {
                if (data.additionalData.foreground)
                {
                    let confirmAlert = this.alertCtrl.create({
                        title: 'Nouvelle notification',
                        message: data.message,
                        buttons: [
                            {
                                text: 'Ignorer',
                                role: 'cancel'
                            },
                            {
                                text: 'Voir',
                                handler: () => {
                                    this.handleNotification(data);
                                }
                            }
                        ]
                    });
                    confirmAlert.present();
                }
                else
                {
                    this.handleNotification(data);
                }
            });


            pushObject.on('error').subscribe(error => {
                console.error('Error while handling notification');
                console.error(error);
            })
        });
    }

    openPage(page)
    {
        this.nav.setRoot(page.component);
    }

    handleNotification(data)
    {
        if (!data.type)
        {
            return;
        }

        if (data.type.toLowerCase() === 'away')
        {
            this.nav.setRoot(AwayPage);
        }
    }
}
