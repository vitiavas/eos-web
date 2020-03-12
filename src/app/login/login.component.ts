import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import ScatterJS from '@scatterjs/core';
import ecc from 'eosjs-ecc';
import { Api } from 'eosjs/dist/eosjs-api';
import * as _ from 'lodash';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { environment } from 'src/environments/environment';
import { v4 as uuid } from "uuid";
import { AlertifyService } from '../services/alertify.service';
import { EosService } from '../services/eos.service';
import { ValidationsMessages } from '../shared/components/field-validation/models/validation-messages.model';
import { ValidationTypeEnum } from '../shared/components/field-validation/models/validation-type.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
/****************************************************************************************************
 ****************************************************************************************************
 ****************************************************************************************************
 * @ngdoc class                                                                                   ***
 * @name LoginComponent                                                                           ***
 * @module components.login.module                                                                ***
 * @requires EosService                                                                           ***
 * @description Users authentication management point                                             ***
 * ## In order to access the system users need to be registered on blockchain                     ***
 * ## Scatter Desktop is required to save keys securelly                                          ***
 ****************************************************************************************************
 **********************************************************ª*****************************************/
export class LoginComponent implements OnInit {

  // Decorator wires up blockUI instance
  @BlockUI() blockUI: NgBlockUI;

  loginSelected = true;
  registerSelected = false;
  alertId: string = uuid();

  loginForm: FormGroup = this.formBuilder.group({
    username: [null, Validators.required],
    uid: [null, Validators.required]
  });

  /**
   * 
   * @param formGroup 
   * mark invalid fields as touched
   */
  public markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      control.updateValueAndValidity();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
  /**
   * Check if fields validations are successfull
   * return true if yes
   */
  validationCallback() {
    this.markFormGroupTouched(this.loginForm);
    this.loginForm.updateValueAndValidity();
    return this.loginForm.valid;
  }

  validations = {
    username: new Array<ValidationsMessages>(
      new ValidationsMessages(ValidationTypeEnum.Required, "login.error.mandatory-username")
    ),
    uid: new Array<ValidationsMessages>(
      new ValidationsMessages(ValidationTypeEnum.Required, "login.error.mandatory-uid")
    ),
  }

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private eosService: EosService,
    private alertifyService: AlertifyService

  ) {
    this.alertifyService.alertId = this.alertId;
  }

  ngOnInit() {
    this.blockUI.stop();
    this.alertifyService.clear();
    this.updateValidators();
  }


  updateValidators() {
    if (this.loginSelected) {
      this.loginForm.get('uid').clearValidators();
      this.loginForm.get('uid').updateValueAndValidity();
    } else {
      this.loginForm.get('uid').setValidators([Validators.required]);
      this.loginForm.get('uid').updateValueAndValidity();
    }
  }

  /**
   * 
   * @param account 
   * @param scatter 
   * Register user on blockchain
   */
  register(account: any, scatter: any) {
    const rpc: any = this.eosService.rpc;
    const eosScatter: any = scatter.eos(this.eosService.network, Api, { rpc });
    const username: any = account.name;
    const hashUID: any = ecc.sha256(this.loginForm.value.uid);
    eosScatter.transact({
      actions: [{
        account: environment.eosio_contract_account_login,
        name: environment.eosio_contract_account_login_action_upsert,
        authorization: [{
          actor: account.name,
          permission: account.authority,
        }],
        data: {
          user: account.name, uid: hashUID, username: username
        },
      }],
    }, {
      blocksBehind: 3,
      expireSeconds: 60
    }).then(() => {
      this.blockUI.stop();
      this.alertifyService.clear();
      this.alertifyService.success('login.success.register', true);
    }).catch(error => {
      this.blockUI.stop();
      this.alertifyService.clear();
      if (error && error.json && error.json.error && error.json.error.details && !_.isEmpty(error.json.error.details) && error.json.error.details[0].message.includes('Utilizador já existe!')) {
        this.alertifyService.error('Utilizador EOS já existe', true);
      } else {
        this.alertifyService.error('generic.error.transaction', true);
      }
    });
  }

  scatter: any;
  /**
   * Login with scatter before register
   */
  async registerWithScatter() {
    if (this.validationCallback()) {
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
      if(!this.scatter) return;
      this.scatter.logout(requiredFields).then(() => {
        this.scatter.login(requiredFields).then(() => {
          // Always use the accounts you got back from Scatter. Never hardcode them even if you are prompting
          // the user for their account name beforehand. They could still give you a different account.
          const account = this.scatter.account('eos');
          if (account && account.publicKey && this.loginForm &&
            this.loginForm.value && account.name == this.loginForm.value.username) {
            this.register(account, this.scatter);
          } else {
            this.blockUI.stop();
            this.alertifyService.clear();
            this.alertifyService.error('login.error.account-name-incorrect', true);
          }
        }, error => {
          this.blockUI.stop();
          this.alertifyService.clear();
          this.alertifyService.error('login.error.register', true);
        });
      }, error => {
        this.blockUI.stop();
        this.alertifyService.clear();
        this.alertifyService.error('login.error.scatter-not-connected', true);
      });
    }
  }

  /**
   * Login Check if user is member of the network 
   * Redirect to home page if true
   */
  login() {
    this.eosService.getLoginRows().then((data: any) => {
      let isCorrect: boolean = false;
      if (data && data.rows && data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          if (data.rows[i].username == this.loginForm.value.username) {
            isCorrect = true;
            localStorage.setItem("user", this.loginForm.value.username);
            localStorage.setItem("uid", data.rows[i].uid);
            this.router.navigate(["home"]);
          }
        }
      }
      if (!isCorrect) {
        this.blockUI.stop();
        this.alertifyService.clear();
        this.alertifyService.error('login.error.username-incorrect', true);
      }
    }).catch(() => {
      this.blockUI.stop();
      this.alertifyService.clear();
      this.alertifyService.error('login.error.username-incorrect', true);
    });
  }

  /**
   * Login with scatter before login
   */
  async loginWithScatter() {
    if (this.validationCallback()) {
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
      if(!this.scatter) return;
      this.scatter.logout(requiredFields).then(() => {
        this.scatter.login(requiredFields).then(() => {
          // Always use the accounts you got back from Scatter. Never hardcode them even if you are prompting
          // the user for their account name beforehand. They could still give you a different account.
          const account = ScatterJS.account('eos');
          if (account && account.publicKey && this.loginForm &&
            this.loginForm.value && account.name == this.loginForm.value.username) {
            this.login();
          } else {
            this.blockUI.stop();
            this.alertifyService.clear();
            this.alertifyService.error('login.error.username-not-match', true);
          }
        }, error => {
          this.blockUI.stop();
          this.alertifyService.clear();
          if (error && error.type == "identity_rejected") {
            this.alertifyService.error('login.error.identity-not-confirmed', true);
          } else {
            this.alertifyService.error('login.error.generic', true);
          }
        });
      }, error => {
        this.blockUI.stop();
        this.alertifyService.clear();
        this.alertifyService.error('login.error.scatter-not-connected', true);
      });
    }
  }

}
































