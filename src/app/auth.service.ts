import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import 'rxjs/add/operator/toPromise';
import { API_URL } from "./main";

@Injectable()
export class AuthService
{
  token = '';
  deviceToken = 'none';
  user = null;
  logged = false;

  constructor(private http: HttpClient)
  {
  }

  async login(username: string, password: string, link: string): Promise<boolean>
  {
    let result = await this.http.get(`${API_URL}/auth/login`, {
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
    const token = localStorage.getItem('sakado.token');

    if (token == null)
    {
      return false;
    }

    let result = await this.http.get(`${API_URL}/auth/validate`, {
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
