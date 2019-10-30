import {Injectable} from '@angular/core';
import {Exercise} from './exercise.model';
import {Subscription} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {UiService} from '../shared/ui.service';
import {Store} from '@ngrx/store';
import * as UiActions from '../shared/ui.actions';
import * as fromTraining from './store/training.reducer';
import * as TrainingActions from './store/training.actions';
import {take} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class TrainingService {
  private firebaseSubscriptions: Subscription[] = [];

  constructor(private db: AngularFirestore,
              private store: Store<fromTraining.State>,
              private uiService: UiService) {
  }

  fetchAvailableExercises() {
    this.store.dispatch(UiActions.startLoading());
    this.firebaseSubscriptions.push(
      this.db.collection<Exercise>('availableExercises').valueChanges({idField: 'id'})
      /*.pipe(map(_ => {
        throw new Error('No internet');
      }))*/
        .subscribe((availableExercises: Exercise[]) => {
          this.store.dispatch(TrainingActions.setAvailableExercises({availableExercises}));
          this.store.dispatch(UiActions.stopLoading());
        }, error => {
          this.store.dispatch(UiActions.stopLoading());
          this.uiService.showSnackbar(`Fetching available exercises failed, please try again later (${error.message})`);
          this.store.dispatch(TrainingActions.setAvailableExercises({availableExercises: []}));
        })
    );
  }

  startExercise(selectedExerciseId: string) {
    this.db.doc<Exercise>(`availableExercises/${selectedExerciseId}`).update({
      lastSelectedDate: new Date()
    });
    this.store.dispatch(TrainingActions.startTraining({selectedExerciseId}));
  }

  completeExercise() {
    this.store.select(fromTraining.getCurrentExercise)
      .pipe(take(1))
      .subscribe((exercise: Exercise) => {
        this.addDataToDatabase({
          ...exercise,
          date: new Date(),
          state: 'completed'
        });
        this.store.dispatch(TrainingActions.stopTraining());
      });
  }

  cancelExercise(progress: number) {
    this.store.select(fromTraining.getCurrentExercise)
      .pipe(take(1))
      .subscribe((exercise: Exercise) => {
        this.addDataToDatabase({
          ...exercise,
          duration: exercise.duration * (progress / 100),
          calories: exercise.calories * (progress / 100),
          date: new Date(),
          state: 'cancelled'
        });
        this.store.dispatch(TrainingActions.stopTraining());
      });
  }

  fetchPastExercises() {
    this.store.dispatch(UiActions.startLoading());
    this.firebaseSubscriptions.push(
      this.db.collection('finishedExercises').valueChanges()
      /*.pipe(map(_ => {
        throw new Error('No internet');
      }))*/
        .subscribe((pastExercises: Exercise[]) => {
          this.store.dispatch(TrainingActions.setPastExercises({pastExercises}));
          this.store.dispatch(UiActions.stopLoading());
        }, error => {
          this.store.dispatch(UiActions.stopLoading());
          this.uiService.showSnackbar(`Fetching past exercises failed, please try again later (${error.message})`);
          this.store.dispatch(TrainingActions.setPastExercises({pastExercises: []}));
        })
    );
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }

  cancelSubscriptions() {
    this.firebaseSubscriptions.forEach(sub => sub.unsubscribe());
  }
}
