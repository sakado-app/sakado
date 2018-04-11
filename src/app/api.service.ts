import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { ServerService } from './server.service';

@Injectable()
export class ApiService
{
    encoding = ['é', 'è', 'ê', 'ô', 'î', 'û', 'É', 'È', 'Ê', 'Ô', 'Î'];

    constructor(private http: HttpClient, private auth: AuthService, private server: ServerService)
    {

    }

    async userQuery(query: string): Promise<any>
    {
        return (await this.query(`
            query {
                user ${query}
            }
        `)).user;
    }

    async userMutation(query: string): Promise<any>
    {
        return (await this.query(`
            mutation {
                user ${query}
            }
        `)).user;
    }

    async query(query: string)
    {
        return JSON.parse(this.decode(JSON.stringify(await this.http.get<any>(`${this.server.url}/graphql`, {
            params: {
                query: this.encode(query)
            },
            headers: {
                Token: this.auth.token
            }
        }).toPromise())));
    }

    encode(string)
    {
        let result = string;

        for (let i = 0; i < this.encoding.length; i++)
        {
            result = result.replace(new RegExp(this.encoding[i], 'g'), `#0${i}`);
        }

        return result;
    }

    decode(string)
    {
        let result = string;

        for (let i = 0; i < this.encoding.length; i++)
        {
            result = result.replace(new RegExp(`#0${i}`, 'g'), this.encoding[i]);
        }

        return result;
    }
}
