import { AfterViewInit, Component, OnInit, ViewChildren } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { PronoteService } from "../../app/pronote.service";
import { AuthService } from "../../app/auth.service";
// import { HomePage } from "../home/home";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage implements OnInit, AfterViewInit
{
  @ViewChildren('username')
  username;

  @ViewChildren('password')
  password;

  logging = false;
  links = [];
  selectedLink = 'loading';

  loginForm = new FormGroup({
    username: new FormControl('', [
      Validators.required
    ]),
    password: new FormControl('', [
      Validators.required
    ])
  });

  constructor(public navCtrl: NavController, public navParams: NavParams, public pronote: PronoteService, public auth: AuthService)
  {
  }

  ngAfterViewInit()
  {
    let saved = localStorage.getItem('sakado.username') || '';

    this.loginForm.setValue({
      username: saved,
      password: ''
    });

    document.getElementById(saved === '' ? 'username' : 'password').focus();
  }

  async ngOnInit()
  {
    try
    {
      this.links = await this.pronote.links() || [];
    }
    catch (e)
    {
    }

    this.selectedLink = localStorage.getItem('sakado.link') || 'loading';
  }

  login()
  {
    this.logging = true;

    const username = this.loginForm.get('username').value;
    const password = this.loginForm.get('password').value;

    localStorage.setItem('sakado.link', this.selectedLink);
    localStorage.setItem('sakado.username', username);

    (async () =>
    {
      let result = await this.auth.login(username, password, this.selectedLink);

      if (result == false)
      {
        throw new Error('Impossible de se connecter');
      }
    })().then(() =>
    {
      console.log('DUDE WTF');
      // this.navCtrl.setRoot(HomePage);
    }).catch(err =>
    {
      console.log('erroreuh');
      console.error(err);
      console.log(err.toString());
      this.logging = false;
    });
  }
}
