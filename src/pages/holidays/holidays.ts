import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../app/api.service';
import { date } from '../../app/util';

@Component({
    selector: 'page-holidays',
    templateUrl: 'holidays.html'
})
export class HolidaysPage implements OnInit
{
    holidays = null;

    constructor(private api: ApiService)
    {
    }

    ngOnInit()
    {
        this.api.userQuery(`{
            holidays {
                day {
                    name
                    time
                }
                period {
                    name
                    from
                    to
                }
            }
        }`).then(result => this.holidays = result.holidays);
    }

    getDaysTo(time)
    {
        let date = new Date(time);
        let today = new Date();

        /*let month = date.getMonth() - today.getMonth();
        let day = date.getDate() - today.getDate();

        return (month * 30) + (Math.floor(month / 2) + ((month + 1) % 2 === 0 ? 0 : (date.getMonth() % 2 == 0 ? 0 : 1))) + day;*/

        let diff = Math.abs(date.getTime() - today.getTime());

        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }

    getDate(time, weekday = true)
    {
        return date(new Date(time), false, weekday, true);
    }
}
