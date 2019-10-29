import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {MatSnackBar} from '@angular/material';

@Injectable({providedIn: 'root'})
export class UiService {
  loadingStateChanged = new Subject<boolean>();

  constructor(private snackBar: MatSnackBar) {
  }

  showSnackbar(message: string, action: string = null, duration: number = 5000) {
    this.snackBar.open(message, action, {duration});
  }
}
