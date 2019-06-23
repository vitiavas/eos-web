
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
// import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { v4 as uuid } from "uuid";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup = this.formBuilder.group({
    username: [null, Validators.required],
    password: [null, Validators.required],
  });

  // validations = {
  //   businessEntity: new Array<ValidationsMessages>(
  //     new ValidationsMessages(ValidationTypeEnum.Required, "login.message.mandatory.businessEntity")
  //   )
  // }

  returnUrl: string;
  submitted = false;
  visible = false;
  businessEntities: any[];
  alertId: string = uuid();

  //todo change me to activate
  protocoled_login_active = true;

   // convenience getter for easy access to form fields
   get f() {
    if(this.loginForm){
      return this.loginForm.controls;
    }
  }

  private subscription$: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    // private alertifyService: AlertifyService,
    // private formService: FormGroupService,
  ) {}

  ngOnInit() {
    // reset login status

  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }

  onSubmit() {

    this.submitted = true;

    if (this.protocoled_login_active && this.loginForm.value.protocoled) {
      // this.redirectToAT();
      return;
    }

    if (this.loginForm.invalid) {
      return;
    }

    let { businessEntity } = this.loginForm.value;

    // validate if there are businessEntities to choose and none was chosen
    if (this.businessEntities && !businessEntity) {
      this.loginForm.controls.businessEntity.setValidators(Validators.required);
      // this.formService.markFormGroupTouched(this.loginForm);
      // if (this.loginForm.invalid) {
      //   return;
      // }
    }

    // this.store.dispatch(
    //   new fromLoginFeature.Login(
    //     this.f.username.value,
    //     this.f.password.value,
    //     businessEntity
    //   )
    // );
  }



  // redirectToAT() {
  //     return this.authService.getRedirectAT(this.returnUrl).pipe(first())
  //     .subscribe(
  //         (response: any) => {
  //           window.location.href = encodeURI(response.data);
  //         },
  //         error => {
  //           this.alertifyService.error(error);
  //         }
  //     );
  // }


  loginAT( nif: string, userId: string, credential: string ) {

    // this.submitted = true;
    // this.authService.loginAT( nif, userId, credential)
    // .pipe( first() )
    // .subscribe(
    // data => {
    //   // let notification;
    //   // this.translate.get( ["generic.welcome"] ).subscribe( res => {
    //   //   notification = res["generic.welcome"];
    //   // });
    //   // this.alertifyService.success( notification );
    //   this.router.navigateByUrl( "/home" );
    // },
    // error => {
    //   this.alertifyService.clear();
    //   this.alertifyService.error( error );
    //   this.visible = true;
    // });
  }

}
