import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_URL } from './main';

@Injectable()
export class ApiService
{
    url = '';

    constructor(private http: HttpClient)
    {
    }

    async load()
    {
        this.url = await this.http.get(`${PROXY_URL}/get`, {
            responseType: 'text'
        }).toPromise();
    }
}
