/*
 *  Sakado, an app for school
 *  Copyright (c) 2017-2018 Adrien 'Litarvan' Navratil
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../app/api.service';
import { date } from '../../app/util';
import { NavController } from 'ionic-angular';
import { MarkDetailPage } from '../mark-detail/mark-detail';

@Component({
    selector: 'page-marks-details',
    templateUrl: 'marks-details.html'
})
export class MarksDetailsPage implements OnInit
{
    marks = [];

    constructor(private api: ApiService, private nav: NavController)
    {
    }

    ngOnInit()
    {
        this.api.userQuery(`{
            periods {
                id
                isDefault
            }
            
            marks {
                period
                marks {
                    name
                    average
                    studentClassAverage
                    minAverage
                    maxAverage
                    
                    marks {
                        title
                        value
                        away
                        max
                        average
                        higher
                        lower
                        coefficient
                        time
                    }
                }
            }
        }`).then(result => {
            const period = result.periods.find(p => p.isDefault);
            this.marks = result.marks.find(p => p.period === period.id).marks;
        });
    }

    openMark(subject, mark)
    {
        this.nav.push(MarkDetailPage, {
            subject,
            mark
        });
    }

    getDate(mark)
    {
        return date(new Date(mark.time), false, true, false, true);
    }

    parseMark(mark)
    {
        if (!mark || isNaN(mark))
        {
            return '....';
        }

        let str = mark + '';

        if (str.indexOf('.') === -1)
        {
            str += '.00';
        }
        else if (str.substring(str.indexOf('.') + 1, str.length).length == 1)
        {
            str += '0';
        }

        return str;
    }
}
