import * as AuthActions from './auth.actions';
import {Action, createReducer, on} from '@ngrx/store';

export interface State {
  isAuthenticated: boolean;
}

const initialState: State = {
  isAuthenticated: false
};

export function authReducer(authState: State | undefined, authAction: Action): State {
  return createReducer(
    initialState,
    on(AuthActions.setAuthenticated, state => ({
      ...state,
      isAuthenticated: true
    })),
    on(AuthActions.setUnauthenticated, state => ({
      ...state,
      isAuthenticated: false
    }))
  )(authState, authAction);
}

export const getIsAuthenticated = (state: State) => state.isAuthenticated;
