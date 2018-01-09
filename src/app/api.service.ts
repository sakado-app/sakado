import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DEBUG, PROXY_URL } from './main';

@Injectable()
export class ApiService
{
    url = '';
    version = '';

    constructor(private http: HttpClient)
    {
    }

    async load()
    {
        if (DEBUG)
        {
            this.url = 'http://127.0.0.1:17334/'
        }
        else
        {
            this.url = "http://" + await this.http.get(`${PROXY_URL}/get`, {
                responseType: 'text'
            }).toPromise() + ":17334";
        }

        try
        {
            this.version = (await this.http.get<any>(`${this.url}/version`).toPromise()).version;
        }
        catch (e) {}
    }
}
