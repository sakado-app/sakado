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
import { Component } from '@angular/core';
import { VERSION } from '../../app/main';
import { LoadingController, ModalController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { LicensePage } from '../license/license';

@Component({
    selector: 'page-about',
    templateUrl: 'about.html'
})
export class AboutPage
{
    version = VERSION;
    licenses: Array<{ name: string, url: string }>;

    constructor(private modal: ModalController, private http: HttpClient, private loading: LoadingController)
    {
        this.licenses = [
            {
                name: 'Ionic Framework 3',
                url: 'https://raw.githubusercontent.com/ionic-team/ionic/master/LICENSE'
            },
            {
                name: 'Angular 5',
                url: 'https://raw.githubusercontent.com/angular/angular/master/LICENSE'
            },
            {
                name: 'Cordova 7',
                url: 'https://raw.githubusercontent.com/apache/cordova-lib/master/LICENSE'
            },
            {
                name: 'RxJS 5',
                url: 'https://raw.githubusercontent.com/ReactiveX/rxjs/master/LICENSE.txt'
            },
            {
                name: 'Phonegap plugin push 2',
                url: 'https://raw.githubusercontent.com/phonegap/phonegap-plugin-push/master/MIT-LICENSE'
            }
        ];
    }

    async showLicense(license)
    {
        let url;

        if (license === undefined)
        {
            url = 'https://raw.githubusercontent.com/sakado-app/sakado/master/LICENSE'
        }
        else
        {
            url = license.url;
        }

        let loading = this.loading.create({
            content: 'Telechargement de la license'
        });
        await loading.present();

        let content = await this.http.get(url, {
            responseType: 'text'
        }).toPromise();

        await loading.dismiss();

        let modal = this.modal.create(LicensePage, {
            content: content
        });
        await modal.present();
    }
}
