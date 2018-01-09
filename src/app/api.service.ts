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
        /*this.url = "http://" + await this.http.get(`${PROXY_URL}/get`, {
            responseType: 'text'
        }).toPromise() + ":17334";*/
        this.url = 'http://127.0.0.1:17334/'
    }
}
