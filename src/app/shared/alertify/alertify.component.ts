import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertifyService } from '../../services/alertify.service';
import { Alertify, AlertifyType } from './alertify.model';



@Component({
  selector: 'app-alert',
  templateUrl: './alertify.component.html',
  styleUrls: ['./alertify.component.scss'],

})
export class AlertifyComponent implements OnInit {
  @Input() id: string;
  @Input() klass: string[];
  @Input() isLoginPage: boolean = false;
  alerts: Alertify[] = [];
  subscrition$: Subscription;

  @Output()
  alertChanges = new EventEmitter();
  constructor(private alertifyService: AlertifyService, private activatedRoute: ActivatedRoute, private cdr: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.subscrition$ = this.alertifyService.getAlert(this.id).subscribe((alert: Alertify) => {
      if (!alert || !alert.message) {
        // clear alerts when an empty alert is received
        this.alerts = [];
        return;
      }
      // add alert to array
      this.alerts = [...this.alerts, alert];
      this.alertChanges.emit(this.alerts);
      this.cdr.detectChanges();
    });
  }

  _type(type: AlertifyType) {
    switch (type) {
      case AlertifyType.Success:
        return "success";
      case AlertifyType.Error:
        return "danger";
      case AlertifyType.Warning:
        return "warning";
      case AlertifyType.Info:
        return "info";
    }

  }

  onClosed(alert) {
    this.alerts = this.alerts.filter(x => x !== alert);
    this.alertChanges.emit(this.alerts);
  }

  ngOnDestroy(): void {
    this.subscrition$.unsubscribe();
  }


}
