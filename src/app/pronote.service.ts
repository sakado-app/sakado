import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import 'rxjs/add/operator/toPromise';
import { AuthService } from "./auth.service";
import { Subject } from 'rxjs/Subject';
import { API_URL } from "./main";

@Injectable()
export class PronoteService
{
  loading = new Subject<boolean>();

  constructor(private http: HttpClient, private auth: AuthService)
  {
  }

  away(): Promise<any>
  {
    return this.http.get(`${API_URL}/away`, {
      headers: {
        Token: this.auth.token
      }
    }).toPromise();
  }

  links(): Promise<any>
  {
    return this.http.get(`${API_URL}/links`).toPromise();
  }
}
