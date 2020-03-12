export class Alertify {
    type: AlertifyType;
    message: string;
    alertId: string;
    timeout: number;
    keepAfterRouteChange: boolean;
    isRoot: boolean = false;
    constructor(init?:Partial<Alertify>) {
        Object.assign(this, init);
    }
}

export enum AlertifyType {
    Success = "success",
    Error = "danger",
    Info = "info",
    Warning="warning"
}
