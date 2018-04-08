import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../app/api.service';
import { NavController } from 'ionic-angular';
import { AddReminderPage } from '../add-reminder/add-reminder';

@Component({
    selector: 'page-reminders',
    templateUrl: 'reminders.html'
})
export class RemindersPage implements OnInit
{
    user = [];
    studentClass = [];

    constructor(private api: ApiService, private nav: NavController)
    {
    }

    ngOnInit(): void
    {
        this.api.userQuery(`{
            reminders {
                title
                content
                time
            }
            
            class {
                reminders {
                    title
                    content
                    author
                    time
                }
            }
        }`).then(result => {
            let sort = (a, b) => {
                if (a.time > b.time) return -1;
                if (a.time == b.time) return 0;
                if (a.time < b.time) return 1;
            };

            this.user = result.reminders;
            this.studentClass = result.class.reminders;

            this.user.sort(sort);
            this.studentClass.sort(sort);
        });
    }

    add(global)
    {
        this.nav.push(AddReminderPage, {
            global
        });
    }
}
