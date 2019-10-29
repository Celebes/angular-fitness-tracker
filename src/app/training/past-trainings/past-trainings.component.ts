import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TrainingService} from '../training.service';
import {Exercise} from '../exercise.model';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Subscription} from 'rxjs';
import {UiService} from '../../shared/ui.service';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.css']
})
export class PastTrainingsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  displayedColumns = [
    'date',
    'name',
    'duration',
    'calories',
    'state'
  ];
  dataSource = new MatTableDataSource<Exercise>();
  sub: Subscription;
  isLoading: boolean;
  uiSub: Subscription;

  constructor(private trainingService: TrainingService,
              private uiService: UiService) {
  }

  ngOnInit() {
    this.uiSub = this.uiService.loadingStateChanged.subscribe(result => this.isLoading = result);
    this.sub = this.trainingService.pastExercisesChanged.subscribe((pastExercises: Exercise[]) => {
      this.dataSource.data = pastExercises;
    });
    this.fetchPastExercises();
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    if (this.uiSub) {
      this.uiSub.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  fetchPastExercises() {
    this.trainingService.fetchPastExercises();
  }
}
