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
import { AfterViewInit, Component, OnInit, ViewChildren } from '@angular/core';
import { AlertController, LoadingController, NavController } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PronoteService } from '../../app/pronote.service';
import { AuthService } from '../../app/auth.service';
import { NextPage } from '../next/next';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage implements OnInit, AfterViewInit
{
    @ViewChildren('username')
    username;

    @ViewChildren('password')
    password;

    logging = false;
    links = [];
    selectedLink = 'loading';

    loginForm = new FormGroup({
        username: new FormControl('', [
            Validators.required
        ]),
        password: new FormControl('', [
            Validators.required
        ])
    });

    constructor(public navCtrl: NavController, public alert: AlertController, public loading: LoadingController, public pronote: PronoteService, public auth: AuthService)
    {
    }

    ngAfterViewInit()
    {
        let saved = localStorage.getItem('sakado.username') || '';

        this.loginForm.setValue({
            username: saved,
            password: ''
        });

        document.getElementById(saved === '' ? 'username' : 'password').focus();
    }

    async ngOnInit()
    {
        try
        {
            this.links = await this.pronote.links() || [];
        }
        catch (e)
        {
        }

        this.selectedLink = localStorage.getItem('sakado.link') || 'loading';
    }

    login()
    {
        this.logging = true;
        let loading = this.loading.create({
            content: 'Connexion en cours'
        });
        loading.present();

        const username = this.loginForm.get('username').value;
        const password = this.loginForm.get('password').value;

        localStorage.setItem('sakado.link', this.selectedLink);
        localStorage.setItem('sakado.username', username);

        (async () => {
            let result = await this.auth.login(username, password, this.selectedLink);

            if (result == false)
            {
                throw new Error('Erreur inconnue');
            }
        })().then(() => {
            loading.dismiss();

            this.navCtrl.setRoot(NextPage);
            this.logging = false;
        }).catch(err => {
            loading.dismiss();

            this.alert.create({
                title: 'Erreur',
                subTitle: err.message,
                buttons: ['OK']
            }).present();

            this.logging = false;
        });
    }
}
