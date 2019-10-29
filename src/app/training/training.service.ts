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
    this.store.dispatch(new UiActions.StartLoading());
    this.firebaseSubscriptions.push(
      this.db.collection<Exercise>('availableExercises').valueChanges({idField: 'id'})
      /*.pipe(map(_ => {
        throw new Error('No internet');
      }))*/
        .subscribe((exercises: Exercise[]) => {
          this.store.dispatch(new TrainingActions.SetAvailableExercises(exercises));
          this.store.dispatch(new UiActions.StopLoading());
        }, error => {
          this.store.dispatch(new UiActions.StopLoading());
          this.uiService.showSnackbar(`Fetching available exercises failed, please try again later (${error.message})`);
          this.store.dispatch(new TrainingActions.SetAvailableExercises([]));
        })
    );
  }

  startExercise(selectedId: string) {
    this.db.doc<Exercise>(`availableExercises/${selectedId}`).update({
      lastSelectedDate: new Date()
    });
    this.store.dispatch(new TrainingActions.StartTraining(selectedId));
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
        this.store.dispatch(new TrainingActions.StopTraining());
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
        this.store.dispatch(new TrainingActions.StopTraining());
      });
  }

  fetchPastExercises() {
    this.store.dispatch(new UiActions.StartLoading());
    this.firebaseSubscriptions.push(
      this.db.collection('finishedExercises').valueChanges()
      /*.pipe(map(_ => {
        throw new Error('No internet');
      }))*/
        .subscribe((pastExercises: Exercise[]) => {
          this.store.dispatch(new TrainingActions.SetPastExercises(pastExercises));
          this.store.dispatch(new UiActions.StopLoading());
        }, error => {
          this.store.dispatch(new UiActions.StopLoading());
          this.uiService.showSnackbar(`Fetching past exercises failed, please try again later (${error.message})`);
          this.store.dispatch(new TrainingActions.SetPastExercises([]));
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
