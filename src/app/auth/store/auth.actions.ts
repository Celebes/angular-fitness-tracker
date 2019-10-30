import {createAction} from '@ngrx/store';

export const setAuthenticated = createAction(
  '[Auth] Set Authenticated'
);

export const setUnauthenticated = createAction(
  '[Auth] Set Unauthenticated'
);
