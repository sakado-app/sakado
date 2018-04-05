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

@Component({
    selector: 'page-marks-details',
    templateUrl: 'marks-details.html'
})
export class MarksDetailsPage implements OnInit
{
    marks = [];

    constructor(private api: ApiService)
    {
    }

    ngOnInit()
    {
        this.api.userQuery(`{
            marks {
                subject
                marks {
                    title
                    value
                    max
                    time
                }
            }
            
            averages {
                subjects {
                    subject
                    value
                }
            }
        }`).then(result => {
            this.marks = result.marks;
            result.averages.subjects.forEach(average => {
                this.marks.forEach(marks => {
                    if (marks.subject === average.subject)
                    {
                        marks.average = average.value;
                    }
                })
            });
        });
    }

    getDate(mark)
    {
        return date(new Date(mark.time), false, true, false);
    }
}
