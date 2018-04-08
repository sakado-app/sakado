import { Component, Input } from '@angular/core';
import { date } from '../../app/util';
import { AuthService } from '../../app/auth.service';
import { ApiService } from '../../app/api.service';
import { NavController } from 'ionic-angular';
import { RemindersPage } from '../../pages/reminders/reminders';

@Component({
    selector: 'reminder',
    templateUrl: 'reminder.html'
})
export class ReminderComponent
{
    @Input()
    reminder;

    @Input()
    global: boolean;

    @Input()
    proposeDelete: boolean;

    constructor(public auth: AuthService, private api: ApiService, private nav: NavController)
    {
    }

    async remove()
    {
        await this.api.userMutation(`{
            ${this.global ? 'class {' : ''}
                removeReminder(title: "${this.reminder.title}") {
                    title
                }
            ${this.global ? '}' : ''}
        }`);

        this.nav.setRoot(RemindersPage);
    }

    isToday(time: number): boolean
    {
        return new Date(time).getDay() == new Date().getDay();
    }

    isTomorrow(time: number): boolean
    {
        return new Date(time).getDay() - 1 == new Date().getDay();
    }

    parseDate(time: number)
    {
        let d = new Date(time);

        if (this.isTomorrow(time))
        {
            return 'demain';
        }

        if (this.isToday(time))
        {
            return 'aujourd\'hui';
        }

        return 'le ' + date(d, false, true, true);
    }
}
