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
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../app/auth.service';
import { NextPage } from '../next/next';
import { ApiService } from '../../app/api.service';
import { EstablishmentsPage } from "../establishment/establishments";

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage implements OnInit, AfterViewInit
{
    logging = false;
    establishment = 'Selectionner...';
    method = '';

    loginForm = new FormGroup({
        username: new FormControl('', [
            Validators.required
        ]),
        password: new FormControl('', [
            Validators.required
        ])
    });

    constructor(private navCtrl: NavController, private alert: AlertController, private loading: LoadingController, private api: ApiService, private auth: AuthService)
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
        this.method = localStorage.getItem('sakado.method');

        if (this.method) {
            this.establishment = localStorage.getItem('sakado.establishment') || this.establishment;
        } else {
            localStorage.removeItem('sakado.establishment'); // Old version
        }
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

        localStorage.setItem('sakado.establishment', this.establishment);
        localStorage.setItem('sakado.method', this.method);
        localStorage.setItem('sakado.username', username);

        (async () => {
            let result = await this.auth.login(username, password, this.establishment, this.method);

            if (result == false)
            {
                throw new Error('Erreur inconnue');
            }

            loading.setContent('Chargement des données...');

            result = await this.auth.fetch();

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

    selectEstablishment()
    {
        this.navCtrl.push(EstablishmentsPage, {
            onSelect: (establishment, method) => {
                this.establishment = establishment;
                this.method = method;
            }
        });
    }
}
