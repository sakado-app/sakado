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
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../app/api.service';
import { AlertController } from "ionic-angular";

@Component({
    selector: 'page-manage',
    templateUrl: 'manage.html'
})
export class ManagePage implements OnInit
{
    representatives = [];

    constructor(private api: ApiService, private alertCtrl: AlertController)
    {
    }

    ngOnInit()
    {
        this.api.userQuery(`{
            class {
                representatives
            }
        }`).then(result => this.representatives = result.class.representatives);
    }

    addRepresentative()
    {
        let prompt = this.alertCtrl.create({
            title: 'Ajouter un délégué',
            message: "Entrez l'IDENTIFIANT du délégué à ajouter (ex: 'adrien.navratil')",
            inputs: [
                {
                    name: 'username',
                    placeholder: "Nom d'utilisateur"
                },
            ],
            buttons: [
                {
                    text: 'Annuler'
                },
                {
                    text: 'Ajouter',
                    handler: data => {
                        this.api.userMutation(`{
                            class {
                                addRepresentative(username: "${data.username}")
                            }
                        }`).then(result => {
                            this.representatives.push(result.class.addRepresentative);
                        })
                    }
                }
            ]
        });
        prompt.present();
    }

    removeRepresentative(representative: string)
    {
        this.api.userMutation(`{
            class {
                removeRepresentative(username: "${representative}")
            }
        }`).then(result => this.representatives.splice(this.representatives.indexOf(result.class.removeRepresentative), 1))
    }
}
