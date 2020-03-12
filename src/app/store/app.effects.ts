import { Injectable } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { Location } from '@angular/common';

import { Effect, Actions, ofType } from '@ngrx/effects';
import * as RouterActions from './app.actions';

import { tap, map, filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';


@Injectable()
export class AppEffects {
  constructor(
    private actions$: Actions,
    private router: Router,
    private location: Location,
    private store: Store<any>
  ) {
    this.listenToRouter();
  }

  @Effect({ dispatch: false })
  navigate$ = this.actions$.pipe(
    ofType(RouterActions.AppActionTypes.GO),
    map((action: RouterActions.Go) => action.payload),
    tap(({ path, query: queryParams, extras }) => {
        console.log('go');
      this.router.navigate(path, { queryParams, ...extras });
    })
  );

  @Effect({ dispatch: false })
  navigateBack$ = this.actions$
    .pipe(
        ofType(RouterActions.AppActionTypes.BACK),
        tap(() => {
        console.log('back');
        this.location.back();
        })
    );

  @Effect({ dispatch: false })
  navigateForward$ = this.actions$
    .pipe(
        ofType(RouterActions.AppActionTypes.FORWARD),
        tap(() => {
            console.log('forward');
            this.location.forward();
        })
    );

    private listenToRouter() {
      this.router.events.pipe(
          filter(event => event instanceof ActivationEnd)
      ).subscribe((event: ActivationEnd) =>
          this.store.dispatch(new RouterActions.RouteChange({
              params: { ...event.snapshot.params },
              path: event.snapshot.routeConfig.path
          }))
      );
  }
}
