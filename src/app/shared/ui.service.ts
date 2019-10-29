import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material';

@Injectable({providedIn: 'root'})
export class UiService {

  constructor(private snackBar: MatSnackBar) {
  }

  showSnackbar(message: string, action: string = null, duration: number = 5000) {
    this.snackBar.open(message, action, {duration});
  }
}
