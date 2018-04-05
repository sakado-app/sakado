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
import { MarksDetailsPage } from '../marks-details/marks-details';

@Component({
    selector: 'page-marks',
    templateUrl: 'marks.html'
})
export class MarksPage implements OnInit
{
    marks = [];
    averages = {};

    constructor(private api: ApiService, private nav: NavController)
    {
    }

    ngOnInit()
    {
        this.api.userQuery(`{
            lastMarks {
                subject
                value
                max
                time
            }
            
            averages {
                student
                studentClass
            }
        }`).then(result => {
            this.marks = result.lastMarks;
            this.averages = result.averages;
        });
    }

    openAverages()
    {
        this.nav.push(MarksDetailsPage);
    }

    getDate(mark)
    {
        return date(new Date(mark.time), false, true, false);
    }
}