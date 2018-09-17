import { Component, Input } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { date } from '../../app/util';

@Component({
    selector: 'page-mark-detail',
    templateUrl: 'mark-detail.html'
})
export class MarkDetailPage
{
    subject: string;
    mark: object;

    constructor(private navParams: NavParams)
    {
        this.subject = navParams.get('subject');
        this.mark = navParams.get('mark');
    }

    small(a)
    {
        if (a.length > 17)
        {
            a = a.substring(0, 17) + '...';
        }

        return a;
    }

    getDate(mark)
    {
        return date(new Date(mark.time), false, true, false, true);
    }
}
