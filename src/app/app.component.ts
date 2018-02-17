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
import { Component, OnInit, ViewChild } from '@angular/core';
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
import { MarksPage } from '../pages/marks/marks';
import { VERSION } from './main';
import { ServerService } from './server.service';

@Component({
    templateUrl: 'app.html'
})
export class SakadoApp implements OnInit
{
    @ViewChild(Nav) nav: Nav;

    rootPage: any;

    pages: Array<{ title: string, component: any, auth?: boolean }>;

    constructor(private platform: Platform, private statusBar: StatusBar, private splashScreen: SplashScreen, private push: Push, private alertCtrl: AlertController, public auth: AuthService, private server: ServerService)
    {
        this.initializeApp();

        this.rootPage = this.auth.logged ? NextPage : LoginPage;

        this.pages = [
            { title: 'Se connecter', component: LoginPage, auth: false },
            { title: 'Prochain cours', component: NextPage, auth: true },
            { title: 'Profs absents', component: AwayPage, auth: true },
            { title: 'Notes', component: MarksPage, auth: true },
            { title: 'Se deconnecter', component: LogoutPage, auth: true },
            { title: 'A Propos', component: AboutPage }
        ]
    }

    ngOnInit()
    {
        let currentSplit = VERSION.split('.');
        let serverSplit = this.server.version.split('.');

        let error = null;

        if (this.auth.error !== null)
        {
            error = {
                title: 'Erreur majeure',
                message: this.auth.error,
                fatal: true
            };
        }
        else if (parseInt(currentSplit[1]) < parseInt(serverSplit[1]))
        {
            error = {
                title: 'Nouvelle version',
                message: 'Une nouvelle version majeure de Sakado est disponible. La mise a jour est necessaire pour pouvoir utiliser l\'application !',
                fatal: true
            };
        }
        else if (parseInt(currentSplit[2]) < parseInt(serverSplit[2]))
        {
            error = {
                title: 'Nouvelle version',
                message: 'Une nouvelle version mineure de Sakado est disponible. Elle permet de regler quelques bugs, mais est facultative',
                fatal: false
            }
        }

        if (error != null)
        {
            return this.alertCtrl.create({
                title: error.title,
                message: error.message,
                buttons: [
                    error.fatal ? {
                        text: 'Quitter',
                        handler: () => {
                            this.platform.exitApp();
                        }
                    } : {
                        text: 'Continuer',
                        role: 'cancel'
                    }
                ]
            }).present();
        }
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
                        title: data.title,
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

        if (data.type.toLowerCase() === 'mark')
        {
            this.nav.setRoot(MarksPage);
        }
    }
}
