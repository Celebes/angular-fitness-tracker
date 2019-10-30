import * as TrainingActions from './training.actions';
import {Exercise} from '../exercise.model';
import * as fromApp from '../../store/app.reducer';
import {Action, createFeatureSelector, createReducer, createSelector, on} from '@ngrx/store';

export interface TrainingState {
  availableExercises: Exercise[];
  pastExercises: Exercise[];
  currentExercise: Exercise;
}

export interface State extends fromApp.State {
  training: TrainingState;
}

const initialState: TrainingState = {
  availableExercises: [],
  pastExercises: [],
  currentExercise: null
};

export function trainingReducer(trainingState: TrainingState | undefined, trainingAction: Action): TrainingState {
  return createReducer(
    initialState,
    on(TrainingActions.setAvailableExercises, (state, action) => ({
      ...state,
      availableExercises: [...action.availableExercises]
    })),
    on(TrainingActions.setPastExercises, (state, action) => ({
      ...state,
      pastExercises: [...action.pastExercises]
    })),
    on(TrainingActions.startTraining, (state, action) => {
      const selectedExercise = state.availableExercises.find(e => e.id === action.selectedExerciseId);
      return {
        ...state,
        currentExercise: {...selectedExercise}
      };
    }),
    on(TrainingActions.stopTraining, state => ({
      ...state,
      currentExercise: null
    }))
  )(trainingState, trainingAction);
}

export const getTrainingState = createFeatureSelector<TrainingState>('training');

export const getAvailableExercises = createSelector(getTrainingState, (state: TrainingState) => state.availableExercises);
export const getPastExercises = createSelector(getTrainingState, (state: TrainingState) => state.pastExercises);
export const getCurrentExercise = createSelector(getTrainingState, (state: TrainingState) => state.currentExercise);
export const isOngoingTraining = createSelector(getTrainingState, (state: TrainingState) => !!state.currentExercise);
