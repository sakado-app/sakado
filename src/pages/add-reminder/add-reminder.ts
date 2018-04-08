import { Component, ViewChildren } from '@angular/core';
import { AlertController, LoadingController, NavController, NavParams } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../app/api.service';
import { RemindersPage } from '../reminders/reminders';
import { AuthService } from '../../app/auth.service';

@Component({
    selector: 'page-add-reminder',
    templateUrl: 'add-reminder.html'
})
export class AddReminderPage
{
    global: boolean;

    adding = false;
    reminderForm = new FormGroup({
        title: new FormControl('', [
            Validators.required
        ]),
        content: new FormControl('', [
            Validators.required
        ]),
        time: new FormControl('', [
            Validators.required
        ])
    });

    constructor(private params: NavParams, private nav: NavController, private loading: LoadingController, private alert: AlertController, private api: ApiService, private auth: AuthService)
    {
        this.global = params.get('global');
    }

    async add()
    {
        this.adding = true;

        if (this.global)
        {
            let cancelled = await new Promise(accept => this.alert.create({
                title: 'Ajouter le rappel ?',
                message: 'Un rappel de la classe est visible par toute la classe, êtes-vous sûr de vouloir l\'ajouter ?',
                buttons: [
                    {
                        text: 'Oui, ajouter',
                        handler: () => accept(false)
                    },
                    {
                        text: 'Non, annuler',
                        handler: () => accept(true)
                    }
                ]
            }).present());

            if (cancelled)
            {
                this.adding = false;
                return;
            }
        }

        const loading = this.loading.create({
            content: 'Ajout du rappel'
        });
        await loading.present();

        const title = this.reminderForm.get('title').value;
        const content = this.reminderForm.get('content').value;
        const time = this.reminderForm.get('time').value;

        console.log(time);

        await this.api.userMutation(`{
            ${this.global ? 'class {' : ''}
                addReminder(title: "${title}", content: "${content}", time: ${new Date(time).getTime()}) {
                    title
                }
            ${this.global ? '}' : ''}
        }`);

        await loading.dismiss();
        await this.nav.setRoot(RemindersPage);
    }
}
