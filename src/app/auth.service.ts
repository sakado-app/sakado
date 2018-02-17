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
export class AuthService
{
    token = '';
    deviceToken = 'none';
    logged = false;
    error = null;
    user = null;

    constructor(private http: HttpClient, private server: ServerService)
    {
    }

    async login(username: string, password: string, link: string): Promise<boolean>
    {
        let result = await this.http.get(`${this.server.url}/auth/login`, {
            params: {
                username: username,
                password: password,
                link: link,
                deviceToken: this.deviceToken
            }
        }).toPromise();

        if (result['success'])
        {
            await this.log(result);
            localStorage.setItem('sakado.token', this.token);

            return true;
        }

        throw new Error(result['message']);
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
            let result = await this.http.get(`${this.server.url}/auth/validate`, {
                headers: {
                    token: token
                }
            }).toPromise();

            if (result['success'])
            {
                await this.log(result);
                return true;
            }
        }
        catch (err)
        {
            this.error = 'Impossible de contacter le serveur Sakado, une maintenance est probablement en cours';
        }

        return false;
    }

    async logout()
    {
        await this.http.get(`${this.server.url}/auth/logout`, {
            headers: {
                token: this.token
            }
        }).toPromise();

        this.logged = false;
        this.token = '';
        this.user = null;
    }

    protected async log(result)
    {
        this.token = result['token'];
        this.logged = true;

        this.user = (await this.http.get<any>(`${this.server.url}/graphql`, {
            params: {
                query: `query {
                    user(token: "${this.token}") {
                        name
                        classe
                        avatar
                    }
                }`
            }
        }).toPromise()).user;
    }
}
