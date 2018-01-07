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
import { AuthService } from '../../app/auth.service';
import { AlertController, LoadingController, NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';

@Component({
    selector: 'page-logout',
    templateUrl: 'logout.html'
})
export class LogoutPage
{
    constructor(private auth: AuthService, private loading: LoadingController, private alert: AlertController, private nav: NavController)
    {
    }

    async logout()
    {
        let loader = this.loading.create({
            content: 'Deconnexion...'
        });

        await loader.present();

        try
        {
            await this.auth.logout();
            await loader.dismiss();

            await this.nav.setRoot(LoginPage);
        }
        catch (e)
        {
            await loader.dismiss();

            this.alert.create({
                title: 'Erreur',
                subTitle: e.message,
                buttons: ['OK']
            }).present();
        }
    }
}
