import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'eos-angular';
  @BlockUI() blockUI: NgBlockUI;

  constructor(
    private translate: TranslateService
    ) {
      translate.setDefaultLang('pt');
      translate.use('pt');
  }
}
