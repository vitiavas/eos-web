import { createSelector } from '@ngrx/store';
import * as fromRoot from './app.reducer';

export const getRouterStateSelector = createSelector(
    fromRoot.getRouterState,
    (routerState) => routerState && routerState.state
);
