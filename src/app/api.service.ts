import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { ServerService } from './server.service';

@Injectable()
export class ApiService
{
    constructor(private http: HttpClient, private auth: AuthService, private server: ServerService)
    {

    }

    async userQuery(query: string): Promise<any>
    {
        return (await this.query(`
            query {
                user(token: "${this.auth.token}") ${query}
            }
        `)).user;
    }

    query(query: string): Promise<any>
    {
        return this.http.get<any>(`${this.server.url}/graphql`, {
            params: {
                query: query
            }
        }).toPromise();
    }
}
