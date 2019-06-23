import { Action } from '@ngrx/store';
import { NavigationExtras } from '@angular/router';

export enum AppActionTypes {
    GO = '[App] GO',
    BACK = '[App] BACK',
    FORWARD = '[App] FORWARD'
}

export class Go implements Action {
    readonly type = AppActionTypes.GO;
    constructor(
        public payload: {
          path: any[];
          query?: object;
          extras?: NavigationExtras
        }
      ) {}
}

export class Back implements Action {
    readonly type = AppActionTypes.BACK;
}

export class Forward implements Action {
    readonly type = AppActionTypes.FORWARD;
}

export class RouteChange implements Action {
    readonly type = '[Router] Route Change';
    constructor(public payload: { params: any, path: string }) {}
  }

export type AppActionsUnion =
  | Go
  | Back
  | Forward;
