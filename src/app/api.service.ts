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
import { ServerService } from './server.service';

@Injectable()
export class ApiService
{
    deviceToken = 'none';
    logged = false;
    error = null;
    user = null;

    constructor(private http: HttpClient, private server: ServerService)
    {
    }

    async login(username: string, password: string, establishment: string): Promise<boolean>
    {
        let result: any = await this.post(`${this.server.url}/auth/login`, {
            params: {
                username: username,
                password: password,
                establishment: establishment,
                deviceToken: this.deviceToken
            }
        });

        if (result['error'])
        {
            throw new Error(result['message']);
        }

        this.user = result;
        this.logged = true;

        localStorage.setItem('sakado.token', result.token);

        return true;
    }

    async refresh(): Promise<any>
    {
        // Loading API URL
        try
        {
            await this.server.load();
        }
        catch (err)
        {
            this.error = 'Impossible de se connecter à Internet';
            return false;
        }

        const token = localStorage.getItem('sakado.token');

        if (token == null)
        {
            return false;
        }

        try
        {
            let result = await this.post('/auth/refresh');

            if (!result['error'])
            {
                this.logged = true;
                this.user = result;

                return true;
            }
        }
        catch (err)
        {
            console.error(err);
            this.error = 'Impossible de contacter le serveur Sakado, une maintenance est probablement en cours';
        }

        return false;
    }

    async logout()
    {
        await this.post(`${this.server.url}/auth/logout`);

        this.logged = false;
        this.user = null;
    }

    async get(path, params = {})
    {
        return this.request(this.http.get, path, params);
    }

    async post(path, params = {})
    {
        return this.request(this.http.post, path, params);
    }

    async request(method, path, params)
    {
        return method(`${this.server.url}${path}`, {
            headers: {
                Authorization: `Bearer ${this.user.token}`
            },
            params
        }).toPromise();
    }

    isRepresentative()
    {
        return this.user.admin || this.user.representative;
    }
}
