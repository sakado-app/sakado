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
import { date, rangeHour } from '../../app/util';

@Component({
    selector: 'page-next',
    templateUrl: 'next.html'
})
export class NextPage implements OnInit
{
    next = null;

    constructor(private api: ApiService)
    {
    }

    ngOnInit()
    {
        this.api.userQuery(`{
            nextLesson {
                subject
                teacher
                room
                
                from
                to
            }
        }`).then(result => this.next = result.nextLesson);
    }

    getDate()
    {
        let from = new Date(this.next.from);
        let to = new Date(this.next.to);

        return date(from) + ' ' + rangeHour(from, to);
    }
}
