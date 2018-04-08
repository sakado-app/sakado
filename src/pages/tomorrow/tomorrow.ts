import { Component, OnInit } from '@angular/core';
import { date, rangeHour } from '../../app/util';
import { ApiService } from '../../app/api.service';

@Component({
    selector: 'page-tomorrow',
    templateUrl: 'tomorrow.html'
})
export class TomorrowPage implements OnInit
{
    timetable = [];
    reminders = [];
    homeworks = [];

    constructor(private api: ApiService)
    {
    }

    ngOnInit(): void
    {
        this.api.userQuery(`{
            tomorrow {
                timetable {
                    subject
                    teacher
                    room
                    
                    away
                    cancelled
                    
                    from
                    to
                }
                reminders {
                    title
                    content
                }
                homeworks {
                    subject
                    content
                    since
                    long
                }
            }
        }`).then(result => {
            this.timetable = result.tomorrow.timetable;
            this.reminders = result.tomorrow.reminders;
            this.homeworks = result.tomorrow.homeworks;
        })
    }

    getDate(lesson)
    {
        return rangeHour(new Date(lesson.from), new Date(lesson.to));
    }

    getTomorrowDate()
    {
        let tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + (tomorrow.getDay() == 6 ? 2 : 1));

        return date(tomorrow);
    }
}
