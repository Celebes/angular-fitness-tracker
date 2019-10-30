import {createAction, props} from '@ngrx/store';
import {Exercise} from '../exercise.model';

export const setAvailableExercises = createAction(
  '[Training] Set Available Exercises',
  props<{ availableExercises: Exercise[] }>()
);

export const setPastExercises = createAction(
  '[Training] Set Past Exercises',
  props<{ pastExercises: Exercise[] }>()
);

export const startTraining = createAction(
  '[Training] Start Training',
  props<{ selectedExerciseId: string }>()
);

export const stopTraining = createAction(
  '[Training] Stop Training'
);
