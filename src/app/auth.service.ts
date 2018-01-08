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
import { ApiService } from './api.service';

@Injectable()
export class AuthService
{
    token = '';
    deviceToken = 'none';
    user = null;
    logged = false;

    constructor(private http: HttpClient, private api: ApiService)
    {
    }

    async login(username: string, password: string, link: string): Promise<boolean>
    {
        let result = await this.http.get(`${this.api.url}/auth/login`, {
            params: {
                username: username,
                password: password,
                link: link,
                deviceToken: this.deviceToken
            }
        }).toPromise();

        if (result['success'])
        {
            this.log(result);
            localStorage.setItem('sakado.token', this.token);

            return true;
        }

        throw new Error(result['message']);
    }

    async refresh(): Promise<any>
    {
        // Loading API URL
        await this.api.load();

        const token = localStorage.getItem('sakado.token');

        if (token == null)
        {
            return false;
        }

        let result = await this.http.get(`${this.api.url}/auth/validate`, {
            headers: {
                token: token
            }
        }).toPromise();

        if (result['success'])
        {
            this.log(result);
            return true;
        }

        return false;
    }

    async logout()
    {
        await this.http.get(`${this.api.url}/auth/logout`, {
            headers: {
                token: this.token
            }
        }).toPromise();

        this.logged = false;
        this.token = '';
        this.user = null;
    }

    protected log(result)
    {
        this.token = result['token'];
        this.user = {
            name: result['name'],
            classe: result['classe'],
            avatar: result['avatar']
        };

        this.logged = true;
    }
}
