import { Component, Input } from '@angular/core';
import { date } from '../../app/util';
import { ApiService } from '../../app/api.service';
import { AuthService } from '../../app/auth.service';

@Component({
    selector: 'homework',
    templateUrl: 'homework.html'
})
export class HomeworkComponent
{
    @Input()
    homework;

    @Input()
    disableEdit;

    representative: boolean;

    constructor(private api: ApiService, private auth: AuthService)
    {
        this.representative = auth.isRepresentative();
    }

    async setLong(event, homework)
    {
        homework.long = (await this.api.userMutation(`{
            homework(id: "${homework.id}") {
                long(long: ${event.checked})
            }
        }`)).homework.long;
    }

    isPassed(time: number): boolean
    {
        return time < new Date().getTime();
    }

    isToday(time: number): boolean
    {
        return new Date(time).getDay() == new Date().getDay();
    }

    isTomorrow(time: number): boolean
    {
        return new Date(time).getDay() - 1 == new Date().getDay();
    }

    getDate(time: number, special: boolean = true)
    {
        let d = new Date(time);

        if (this.isTomorrow(time) && special)
        {
            return 'demain';
        }

        if (this.isToday(time) && special)
        {
            return 'aujourd\'hui';
        }

        return 'le ' + date(d, false, true, false);
    }
}
