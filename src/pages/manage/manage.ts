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
import { AlertController, LoadingController } from 'ionic-angular';

@Component({
    selector: 'page-manage',
    templateUrl: 'manage.html'
})
export class ManagePage implements OnInit
{
    representatives = [];

    constructor(private api: ApiService, private alertCtrl: AlertController, private loading: LoadingController)
    {
    }

    async send(content)
    {
        content = content.replace(/\n/g, ' ');

        let cancel = await new Promise(accept => this.alertCtrl.create({
            title: 'Envoyer la notification ?',
            message: `Voulez vous envoyer '${content}' à TOUTE la classe ?`,
            buttons: [
                {
                    text: 'Oui, envoyer',
                    handler: () => accept(false)
                },
                {
                    text: 'Non, annuler',
                    handler: () => accept(true)
                }
            ]
        }).present());

        if (cancel)
        {
            return;
        }

        let loading = this.loading.create({
            content: 'Envoi en cours...'
        });

        await loading.present();
        await this.api.userMutation(`{
            class {
                notify(content: "${content}")
            }
        }`);
        await loading.dismiss();

        this.alertCtrl.create({
            title: 'Terminé',
            message: 'Envoi terminé !',
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        }).present();
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
            message: "Entrez le nom COMPLET du délégué à ajouter (ex: 'Adrien Navratil')",
            inputs: [
                {
                    name: 'user',
                    placeholder: "Nom du délégué"
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
                                addRepresentative(user: "${data.user}")
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
                removeRepresentative(user: "${representative}")
            }
        }`).then(result => this.representatives.splice(this.representatives.indexOf(result.class.removeRepresentative), 1))
    }
}
