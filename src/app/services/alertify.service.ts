import { Injectable } from "@angular/core";
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationStart, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import * as _ from 'lodash';
import { isArray } from "ngx-bootstrap";
import { BehaviorSubject, Observable } from "rxjs";
import { Alertify, AlertifyType } from "../shared/alertify/alertify.model";

declare let alertify: any;

@Injectable()
export class AlertifyService {
    private subject = new BehaviorSubject<Alertify>(null);
    private keepAfterRouteChange = true;

    public alertId: string = undefined;

    constructor(private translate: TranslateService, private activatedRoute: ActivatedRoute, private router: Router) {
        // clear alert messages on route change unless 'keepAfterRouteChange' flag is true
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterRouteChange) {
                    // only keep for a single route change
                    this.keepAfterRouteChange = false;
                } else {
                    // clear alert messages
                    //  this.clear();
                }
            }
        });
    }

    confirm(message: string, okCallback: () => any) {
        alertify.confirm(message, function (e) {
            if (e) {
                okCallback();
            } else {
            }
        });
    }

    // subscribe to alerts
    getAlert(alertId?: string): Observable<any> {
        return this.subject
            .asObservable();
    }

    warning(alerts, alertId: string = null) {
        if (alerts) {
            alerts.map(alert => alert.level === 'WARNING' ?
                this.alert(new Alertify({ message: alert.message, type: AlertifyType.Warning, alertId: alertId }))
                : null);
        }
    }

    // success(message: string, translate: boolean = false) {
    //   if (translate) {
    //     let notification;
    //     this.translate.get([message]).subscribe(res => {
    //       notification = res[message];
    //       alertify.success(notification);
    //     });
    //   } else {
    //     alertify.success(message);
    //   }
    // }
    success(message: string, translate: boolean = false) {

        if (translate) {
            let notification: string;
            this.translate.get([message]).subscribe(res => {
                notification = res[message];
                this.alert(new Alertify({ message: notification, type: AlertifyType.Success, alertId: this.alertId, timeout: 5000 }));
            });
        } else {
            this.alert(new Alertify({ message, type: AlertifyType.Success, alertId: this.alertId, timeout: 5000 }));
        }


    }

    // error(message: string, translate: boolean = false) {
    //   if (translate) {
    //     let notification;
    //     this.translate.get([message]).subscribe(res => {
    //       notification = res[message];
    //       alertify.error(notification);
    //     });
    //   } else {
    //     alertify.error(message);
    //   }
    // }

    processAlerts(alerts: any, form: FormGroup) {
        // clear current alerts
        this.clear();
        // process alerts
        if (alerts && alerts instanceof Array) {
            alerts.forEach(alert => {
                this.processAlertMessage(alert, form);
            });
        }
    }

    show(alerts: any, form: FormGroup, clearAlerts: boolean) {
        // clear current alerts
        if (clearAlerts) {
            this.clear();
        }
        // process alerts
        if (_.isString(alerts)) {
            this.processAlertMessage(alerts, form);
        }
        else if (alerts && alerts instanceof Array) {
            alerts.forEach(alert => {
                this.processAlertMessage(alert, form);
            });
        }

    }

    processAlertMessage(alert: any, form: FormGroup) {
        if (alert) {
            // process fields
            this.processAlertMessageFields(alert.fields, form);
            // show alert
            this.showAlert(alert);
        }
    }

    processAlertMessageFields(fields: any, form: FormGroup) {
        // show errors
        if (fields) {
            fields.forEach(field => {
                if (form.controls[field]) {
                    form.controls[field].setErrors({ 'invalid': true });
                }
            });
        }
    }

    showAlert(alert: any) {
        switch (alert.level.toLowerCase()) {
            case AlertifyType.Warning: {
                this.warn(alert.message);
                break;
            }
            case AlertifyType.Error: {
                this.error(alert.message);
                break;
            }
            case AlertifyType.Info: {
                this.info(alert.message);
                break;
            }
            case AlertifyType.Success: {
                this.success(alert.message);
                break;
            }
        }
    }

    error(message: any, translate: boolean = false, alertId: string = undefined) {
        if (translate) {
            let notification: string;
            this.translate.get([message]).subscribe(res => {
                notification = res[message];
                this.alert(new Alertify({ message: notification, type: AlertifyType.Error, alertId: alertId || this.alertId }));
            });
        } else {
            if (isArray(message)) {
                message.forEach((x: any) => {
                    if (x.message) {
                        let message = x.message
                        this.alert(new Alertify({ message, type: AlertifyType.Error, alertId: alertId || this.alertId }))
                    }
                }
                )
            }
            else
                if (message) {
                    this.alert(new Alertify({ message, type: AlertifyType.Error, alertId: alertId || this.alertId }));
                }
        }

    }

    message(message: string) {
        alertify.message(message);
    }
    info(message: string, translate: boolean = false) {
        if (translate) {
            let notification: string;
            this.translate.get([message]).subscribe(res => {
                notification = res[message];
                this.alert(new Alertify({ message: notification, type: AlertifyType.Info, alertId: this.alertId }));
            });
        } else {
            this.alert(new Alertify({ message, type: AlertifyType.Info, alertId: this.alertId }));
        }

    }

    // warning(message: string) {
    //   alertify.warning(message);
    // }

    warn(message: string, translate: boolean = false) {
        if (translate) {
            let notification: string;
            this.translate.get([message]).subscribe(res => {
                notification = res[message];
                this.alert(new Alertify({ message: notification, type: AlertifyType.Warning, alertId: this.alertId, timeout: 5000 }));
            });
        } else {
            this.alert(new Alertify({ message, type: AlertifyType.Warning, alertId: this.alertId }));
        }
    }
    warnHeader(message: string, translate: boolean = false) {
        if (translate) {
            let notification: string;
            this.translate.get([message]).subscribe(res => {
                notification = res[message];
                this.alert(new Alertify({ message: notification, type: AlertifyType.Warning, alertId: undefined, timeout: 5000, keepAfterRouteChange: true }));
            });
        } else {
            this.alert(new Alertify({ message, type: AlertifyType.Warning, alertId: undefined, timeout: 5000, keepAfterRouteChange: true }));
        }
    }
    // main alert method
    alert(alert: Alertify) {
        this.keepAfterRouteChange = alert.keepAfterRouteChange;
        this.subject.next(alert);
    }

    // clear alerts
    clear(alertId?: string) {
        this.subject.next(new Alertify({ alertId: this.alertId || alertId }));
    }

    showAlerts(alerts: any, translate: boolean = false) {
        if (_.isString(alerts)) {
            this.error(alert)
        } else if (_.isArray(alerts)) {
            alerts.forEach(alert => {
                switch (alert.level.toLowerCase()) {
                    case AlertifyType.Warning: {
                        this.warn(alert.message, translate);
                        break;
                    }
                    case AlertifyType.Error: {
                        let final_error
                        if (alert.message && !alert.details) {
                            final_error = alert.message;
                        } else if (!alert.message && alert.details) {
                            final_error = alert.details
                        } else if (alert.message && alert.details) {
                            final_error = alert.message.concat("\n", alert.details);
                        }
                        this.error(final_error, translate);
                        break;
                    }
                }
            });
        }
    }

    // success(message: string, translate: boolean = false) {
    //   if (translate) {
    //     let notification;
    //     this.translate.get([message]).subscribe(res => {
    //       notification = res[message];
    //       alertify.success(notification);
    //     });
    //   } else {
    //     alertify.success(message);
    //   }
    // }

    // error(message: string, translate: boolean = false) {
    //   if (translate) {
    //     let notification;
    //     this.translate.get([message]).subscribe(res => {
    //       notification = res[message];
    //       alertify.error(notification);
    //     });
    //   } else {
    //     alertify.error(message);
    //   }
    // }

    // warning(message: string) {
    //   alertify.warning(message);
    // }

    // message(message: string) {
    //   alertify.message(message);
    // }
}
