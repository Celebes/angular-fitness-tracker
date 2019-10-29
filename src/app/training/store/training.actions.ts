import {Action} from '@ngrx/store';
import {Exercise} from '../exercise.model';

export const SET_AVAILABLE_EXERCISES = '[Training] Set Available Exercises';
export const SET_PAST_EXERCISES = '[Training] Set Past Exercises';
export const START_TRAINING = '[Training] Start Training';
export const STOP_TRAINING = '[Training] Stop Training';

export class SetAvailableExercises implements Action {
  type = SET_AVAILABLE_EXERCISES;

  constructor(public payload: Exercise[]) {
  }
}

export class SetPastExercises implements Action {
  type = SET_PAST_EXERCISES;

  constructor(public payload: Exercise[]) {
  }
}

export class StartTraining implements Action {
  type = START_TRAINING;

  constructor(public payload: string) {
  }
}

export class StopTraining implements Action {
  type = STOP_TRAINING;
}

export type TrainingActions = SetAvailableExercises | SetPastExercises | StartTraining | StopTraining;
