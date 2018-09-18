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
    untilPeriodWeek = 0;

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
                
                untilDay
                untilPeriod
            }
        }`).then(result => {
            this.holidays = result.holidays;

            let until = result.holidays.untilPeriod;
            this.untilPeriodWeek = (until - (until % 7)) / 7;
        });
    }

    getDate(time, weekday = true)
    {
        return date(new Date(time), false, weekday, true);
    }
}
