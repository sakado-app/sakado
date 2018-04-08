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
import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { SakadoApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push } from '@ionic-native/push';
import { LoginPage } from '../pages/login/login';
import { AuthService } from './auth.service';
import { HttpClientModule } from '@angular/common/http';
import { NextPage } from '../pages/next/next';
import { AboutPage } from '../pages/about/about';
import { LogoutPage } from '../pages/logout/logout';
import { AwayPage } from '../pages/away/away';
import { LicensePage } from '../pages/license/license';
import { ServerService } from './server.service';
import { MarksPage } from '../pages/marks/marks';
import { ApiService } from './api.service';
import { HomeworksPage } from '../pages/homeworks/homeworks';
import { ManagePage } from "../pages/manage/manage";
import { MarksDetailsPage } from '../pages/marks-details/marks-details';
import { RemindersPage } from '../pages/reminders/reminders';
import { ReminderComponent } from '../components/reminder/reminder';
import { MarkDetailPage } from '../pages/mark-detail/mark-detail';
import { AddReminderPage } from '../pages/add-reminder/add-reminder';

export function authServiceFactory(auth: AuthService): Function
{
    return () => auth.refresh().catch(err => console.warn(`Couldn't refresh : ${err}`));
}

@NgModule({
    declarations: [
        SakadoApp,
        LoginPage,
        NextPage,
        AboutPage,
        LogoutPage,
        AwayPage,
        LicensePage,
        MarksPage,
        MarksDetailsPage,
        HomeworksPage,
        ManagePage,
        RemindersPage,
        MarkDetailPage,
        AddReminderPage,

        ReminderComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,

        IonicModule.forRoot(SakadoApp)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        SakadoApp,
        LoginPage,
        NextPage,
        AboutPage,
        LogoutPage,
        AwayPage,
        LicensePage,
        MarksPage,
        MarksDetailsPage,
        HomeworksPage,
        ManagePage,
        RemindersPage,
        MarkDetailPage,
        AddReminderPage,

        ReminderComponent
    ],
    providers: [
        StatusBar,
        SplashScreen,
        Push,
        ServerService,
        AuthService,
        ApiService,

        {
            provide: APP_INITIALIZER,
            useFactory: authServiceFactory,
            deps: [AuthService],
            multi: true
        },

        {
            provide: ErrorHandler,
            useClass: IonicErrorHandler
        }
    ]
})
export class AppModule
{
}
