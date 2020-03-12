import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import ScatterJS from '@scatterjs/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AlertifyService } from 'src/app/services/alertify.service';
import { EosService } from 'src/app/services/eos.service';
import * as fromRoot from "../../store";
import { Logout } from '../../store';


@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {

  // Decorator wires up blockUI instance
  @BlockUI() blockUI: NgBlockUI;
  production: boolean = true;
  mediaSize: any;
  alerts: Array<{}>;
  scatter: any;
  user: any;
  uid: any;
  constructor(private translate: TranslateService,
    private store: Store<fromRoot.AppState>,
    private eosService: EosService,
    private alertifyService: AlertifyService,
    private router: Router) {
    translate.setDefaultLang('pt');
    translate.use('pt');

  }

  goHome() {
    this.router.navigate(["home"]);
  }
  
  isHome() {
    let currentUrl = this.router.url;
    if(currentUrl.includes('/home')) {
      return true;
    } else {
      return false;
    }
  } 

  clearStorage() {
    this.store.dispatch(new Logout());
    localStorage.clear();
    sessionStorage.clear();
  }

  async logout() {
    const requiredFields = { accounts: [this.eosService.network] };
    this.blockUI.start();
    if (!this.eosService.scatter) {
      this.scatter = await ScatterJS.scatter.connect('eos-angular').then((connected: boolean) => {
        if (!connected) {
          this.blockUI.stop();
          this.alertifyService.clear();
          this.alertifyService.error('login.error.scatter-not-connected', true);
          return false;
        }
        return ScatterJS.scatter;
      });
    } else {
      this.scatter = this.eosService.scatter;
    }
    this.scatter.logout(requiredFields).then(() => {
      this.clearStorage();
      this.router.navigate(['login']);
    }, error => {
      this.blockUI.stop();
      this.alertifyService.clear();
      this.alertifyService.error('login.error.logout', true);
    });
  }

  ngOnInit() {
    this.user = localStorage.getItem("user");
    this.uid = localStorage.getItem("uid");
  }

}
