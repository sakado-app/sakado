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
import { NavController, NavParams } from 'ionic-angular';
import { ApiService } from "../../app/api.service";

@Component({
    selector: 'page-establishments',
    templateUrl: 'establishments.html'
})
export class EstablishmentsPage implements OnInit
{
    establishments: any[];
    onSelect: Function;

    constructor(private nav: NavController, private navParams: NavParams, private api: ApiService)
    {
        this.onSelect = navParams.data.onSelect;
    }

    async ngOnInit()
    {
        try
        {
            this.establishments = (await this.api.query(`
                query {
                    establishments {
                        name
                        methods {
                            name
                        }
                    }
                }
            `)).establishments || [];
        }
        catch (e)
        {
        }
    }

    select(establishment, method)
    {
        this.onSelect(establishment, method);
        this.nav.pop();
    }
}
