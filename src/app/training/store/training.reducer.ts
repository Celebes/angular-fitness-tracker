import {
  SET_AVAILABLE_EXERCISES,
  SET_PAST_EXERCISES,
  SetAvailableExercises,
  SetPastExercises,
  START_TRAINING,
  StartTraining,
  STOP_TRAINING,
  TrainingActions
} from './training.actions';
import {Exercise} from '../exercise.model';
import * as fromApp from '../../store/app.reducer';
import {createFeatureSelector, createSelector} from '@ngrx/store';

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

export function trainingReducer(state = initialState, action: TrainingActions): TrainingState {
  switch (action.type) {
    case SET_AVAILABLE_EXERCISES:
      return {
        ...state,
        availableExercises: [...(action as SetAvailableExercises).payload]
      };
    case SET_PAST_EXERCISES:
      return {
        ...state,
        pastExercises: [...(action as SetPastExercises).payload]
      };
    case START_TRAINING:
      const selectedId = (action as StartTraining).payload;
      const currentExercise = state.availableExercises.find(e => e.id === selectedId);
      return {
        ...state,
        currentExercise: {...currentExercise}
      };
    case STOP_TRAINING:
      return {
        ...state,
        currentExercise: null
      };
    default:
      return state;
  }
}

export const getTrainingState = createFeatureSelector<TrainingState>('training');

export const getAvailableExercises = createSelector(getTrainingState, (state: TrainingState) => state.availableExercises);
export const getPastExercises = createSelector(getTrainingState, (state: TrainingState) => state.pastExercises);
export const getCurrentExercise = createSelector(getTrainingState, (state: TrainingState) => state.currentExercise);
export const isOngoingTraining = createSelector(getTrainingState, (state: TrainingState) => !!state.currentExercise);
