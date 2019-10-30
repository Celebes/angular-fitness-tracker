import {Action, createReducer, on} from '@ngrx/store';
import * as UiActions from './ui.actions';

export interface State {
  isLoading: boolean;
}

const initialState: State = {
  isLoading: false
};

export function uiReducer(uiState: State | undefined, uiAction: Action): State {
  return createReducer(
    initialState,
    on(UiActions.startLoading, state => ({
      ...state,
      isLoading: true
    })),
    on(UiActions.stopLoading, state => ({
      ...state,
      isLoading: false
    }))
  )(uiState, uiAction);
}

export const getIsLoading = (state: State) => state.isLoading;
