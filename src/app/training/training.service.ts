import {Injectable} from '@angular/core';
import {Exercise} from './exercise.model';
import {Subject, Subscription} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';

@Injectable({providedIn: 'root'})
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  pastExercisesChanged = new Subject<Exercise[]>();
  private availableExercises: Exercise[] = [];
  private currentExercise: Exercise;
  private firebaseSubscriptions: Subscription[] = [];

  constructor(private db: AngularFirestore) {
  }

  fetchAvailableExercises() {
    this.firebaseSubscriptions.push(
      this.db.collection<Exercise>('availableExercises').valueChanges({idField: 'id'})
        .subscribe((exercises: Exercise[]) => {
          this.availableExercises = exercises;
          this.exercisesChanged.next([...this.availableExercises]);
        }, error => {
          console.log(error);
        })
    );
  }

  startExercise(selectedId: string) {
    this.db.doc<Exercise>(`availableExercises/${selectedId}`).update({
      lastSelectedDate: new Date()
    });
    this.currentExercise = this.availableExercises.find(e => e.id === selectedId);
    this.exerciseChanged.next(this.currentExercise);
  }

  getCurrentExercise() {
    return {...this.currentExercise};
  }

  completeExercise() {
    this.addDataToDatabase({
      ...this.currentExercise,
      date: new Date(),
      state: 'completed'
    });
    this.currentExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.addDataToDatabase({
      ...this.currentExercise,
      duration: this.currentExercise.duration * (progress / 100),
      calories: this.currentExercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled'
    });
    this.currentExercise = null;
    this.exerciseChanged.next(null);
  }

  fetchPastExercises() {
    this.firebaseSubscriptions.push(
      this.db.collection('finishedExercises').valueChanges()
        .subscribe((pastExercises: Exercise[]) => {
          this.pastExercisesChanged.next(pastExercises);
        }, error => {
          console.log(error);
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
