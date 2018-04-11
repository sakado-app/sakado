import { Component, OnInit } from '@angular/core';
import { date, parseHour, rangeHour } from '../../app/util';
import { ApiService } from '../../app/api.service';

@Component({
    selector: 'page-tomorrow',
    templateUrl: 'tomorrow.html'
})
export class TomorrowPage implements OnInit
{
    today = new Date().getHours() <= 15;

    loaded = false;

    tomorrow;
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
                tomorrow
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
            this.tomorrow = result.tomorrow.tomorrow;
            this.timetable = result.tomorrow.timetable;
            this.reminders = result.tomorrow.reminders;
            this.homeworks = result.tomorrow.homeworks;

            this.loaded = true;
        })
    }

    getContent(content: string)
    {
        return content.replace(/\n/g, '<br/>');
    }

    getHours()
    {
        return new Date(this.timetable[0].from).getHours() + 'h-' + new Date(this.timetable[this.timetable.length - 1].to).getHours() + 'h';
    }

    getDate(lesson)
    {
        return rangeHour(new Date(lesson.from), new Date(lesson.to));
    }

    getTomorrowDate(tomorrow)
    {
        return date(new Date(tomorrow));
    }
}
