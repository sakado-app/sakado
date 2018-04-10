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

@Component({
    selector: 'page-homeworks',
    templateUrl: 'homeworks.html'
})
export class HomeworksPage implements OnInit
{
    homeworks = [];

    constructor(private api: ApiService)
    {
    }

    ngOnInit()
    {
        this.api.userQuery(`{
            homeworks {
                id
                subject
                content
                since
                until
                long
            }
        }`).then(result => this.homeworks = result.homeworks.filter(h => {
            return !this.isPassed(h.until);
        }));
    }

    isPassed(time: number): boolean
    {
        let date = new Date();
        date.setDate(date.getDate() + 1);

        return time < date.getTime();
    }
}
