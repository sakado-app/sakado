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
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';
import { AuthService } from './auth.service';
import { Subject } from 'rxjs/Subject';
import { ApiService } from './api.service';

@Injectable()
export class PronoteService
{
    loading = new Subject<boolean>();

    constructor(private http: HttpClient, private auth: AuthService, private api: ApiService)
    {
    }

    away(): Promise<any>
    {
        return this.withToken('away');
    }

    next(): Promise<any>
    {
        return this.withToken('next');
    }

    notes(): Promise<any>
    {
        return this.withToken('notes');
    }

    links(): Promise<any>
    {
        return this.get('links');
    }

    withToken(request: string): Promise<any>
    {
        return this.get(request, {
            headers: {
                Token: this.auth.token
            }
        });
    }

    get(request: string, params = {}): Promise<any>
    {
        return this.http.get(`${this.api.url}/${request}`, params).toPromise();
    }
}
