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
import { DEBUG, SERVER_URL } from './main';

@Injectable()
export class ServerService
{
    url = '';
    version = '';

    constructor(private http: HttpClient)
    {
    }

    async load()
    {
        if (!DEBUG)
        {
            await this.http.get(`https://jsonplaceholder.typicode.com/posts/1`).toPromise(); // Internet checking !
        }

        if (DEBUG)
        {
            this.url = 'http://127.0.0.1:17334/'
        }
        else
        {
            this.url = SERVER_URL;
        }

        try
        {
            this.version = (await this.http.get<any>(`${this.url}/version`).toPromise()).version;
        }
        catch (e) {}
    }
}
