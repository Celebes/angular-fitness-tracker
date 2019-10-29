import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {StopTrainingDialogComponent} from './stop-training-dialog/stop-training-dialog.component';
import {TrainingService} from '../training.service';
import {Store} from '@ngrx/store';
import * as fromTraining from '../store/training.reducer';
import {Exercise} from '../exercise.model';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit {
  progress = 0;
  timer: NodeJS.Timer;

  constructor(private dialog: MatDialog,
              private store: Store<fromTraining.State>,
              private trainingService: TrainingService) {
  }

  ngOnInit() {
    this.startOrResumeTimer();
  }

  startOrResumeTimer() {
    this.store.select(fromTraining.getCurrentExercise)
      .pipe(take(1))
      .subscribe((exercise: Exercise) => {
        // podzielic na 100% i pomnozyc przez 1000 zeby uzyskac milisekundy
        const step = (exercise.duration / 100) * 1000;

        this.timer = setInterval(() => {
          this.progress += 1;
          if (this.progress >= 100) {
            this.trainingService.completeExercise();
            clearInterval(this.timer);
          }
        }, step);
      });
  }

  onStop() {
    clearInterval(this.timer);
    const dialogRef = this.dialog.open(StopTrainingDialogComponent, {
      data: {
        progress: this.progress
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.trainingService.cancelExercise(this.progress);
      } else {
        this.startOrResumeTimer();
      }
    });
  }
}
