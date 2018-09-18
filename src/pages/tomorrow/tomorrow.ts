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

            for (let i = 0; i < this.timetable.length; i++)
            {
                if (i + 1 < this.timetable.length)
                {
                    let diff = this.timetable[i + 1].from - this.timetable[i].to;

                    if (diff > 60000 * 90)
                    {
                        this.timetable[i].beforeBigHole = true;
                    }
                    else if (diff > 60000 * 40)
                    {
                        this.timetable[i].beforeHole = true;
                    }
                }
            }

            this.loaded = true;
        })
    }

    getContent(content: string)
    {
        return content.replace(/\n/g, '<br/>');
    }

    getHours()
    {
        let first = this.timetable[0];
        let lastID = 1;
        let last;

        let hasCancelled = false;

        do {
            last = this.timetable[this.timetable.length - lastID];
            lastID++;

            if (last.cancelled) hasCancelled = true;
        } while (this.timetable.length > lastID && (last.away || last.cancelled));

        return new Date(first.from).getHours() + 'h-' + new Date(last.to).getHours() + 'h' + (hasCancelled ? '?' : '');
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
