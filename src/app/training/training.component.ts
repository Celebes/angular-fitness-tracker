import {Component, OnDestroy, OnInit} from '@angular/core';
import {TrainingService} from './training.service';
import {Exercise} from './exercise.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit, OnDestroy {
  ongoingTraining = false;
  sub: Subscription;

  constructor(private trainingService: TrainingService) {
  }

  ngOnInit() {
    this.sub = this.trainingService.exerciseChanged.subscribe((exercise: Exercise) => {
        this.ongoingTraining = !!exercise;
      }
    );
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
