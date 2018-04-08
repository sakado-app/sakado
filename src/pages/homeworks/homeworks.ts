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
import { AuthService } from "../../app/auth.service";

@Component({
    selector: 'page-homeworks',
    templateUrl: 'homeworks.html'
})
export class HomeworksPage implements OnInit
{
    homeworks = [];
    representative: boolean;

    constructor(private api: ApiService, private auth: AuthService)
    {
        this.representative = auth.isRepresentative();
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
        }`).then(result => this.homeworks = result.homeworks.filter(h => !this.isPassed(h.until)));
    }

    async setLong(event, homework)
    {
        homework.long = (await this.api.userMutation(`{
            homework(id: "${homework.id}") {
                long(long: ${event.checked})
            }
        }`)).homework.long;
    }

    isPassed(time: number): boolean
    {
        return new Date(time).getDay() < new Date().getDay();
    }

    isToday(time: number): boolean
    {
        return new Date(time).getDay() == new Date().getDay();
    }

    isTomorrow(time: number): boolean
    {
        return new Date(time).getDay() - 1 == new Date().getDay();
    }

    getDate(time: number, special: boolean = true)
    {
        let d = new Date(time);

        if (this.isTomorrow(time) && special)
        {
            return 'demain';
        }

        if (this.isToday(time) && special)
        {
            return 'aujourd\'hui';
        }

        return 'le ' + date(d, false, true, false);
    }
}
