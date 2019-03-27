import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ApiService } from "../../app/api.service";

@Component({
    selector: 'page-establishments',
    templateUrl: 'establishments.html'
})
export class EstablishmentsPage implements OnInit
{
    establishments: any[];
    onSelect: Function;

    constructor(private nav: NavController, private navParams: NavParams, private api: ApiService)
    {
        this.onSelect = navParams.data.onSelect;
    }

    async ngOnInit()
    {
        try
        {
            this.establishments = (await this.api.query(`
                query {
                    establishments {
                        name
                        methods {
                            name
                        }
                    }
                }
            `)).establishments || [];
        }
        catch (e)
        {
        }
    }

    select(establishment, method)
    {
        this.onSelect(establishment, method);
        this.nav.pop();
    }
}
