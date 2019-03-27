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
import { ToastController } from 'ionic-angular';

@Component({
    selector: 'page-away',
    templateUrl: 'away.html'
})
export class AwayPage implements OnInit
{
    away = null;

    constructor(private api: ApiService, private toast: ToastController)
    {
    }

    ngOnInit()
    {
        this.api.userQuery(`{
            away {
                time
                
                content {
                    subject
                    teacher
                    
                    away
                    cancelled
                    
                    from
                    to
                }
            }
        }`).then(result =>
        {
            const today = new Date();
            today.setHours(0);

            this.away = result.away.map(w => {
                w.content = w.content.filter(l => l.from > today.getTime());
                return w;
            });
        });
    }

    coursDate(lesson)
    {
        return date(new Date(lesson.from), false) + ' ' + rangeHour(new Date(lesson.from), new Date(lesson.to));
    }

    weekDate(week)
    {
        let from = new Date(week.time);
        let to = new Date(week.time);
        to.setDate(to.getDate() + 5);

        return date(from, false, false) + ' - ' + date(to, false, false, true);
    }

    displayHelp()
    {
        this.toast.create({
            message: 'Signifie souvent un examen, une sortie scolaire ou un cours déplacé',
            duration: 4000
        }).present();
    }
}
