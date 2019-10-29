import {Injectable} from '@angular/core';
import {AuthData} from './auth-data.model';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {TrainingService} from '../training/training.service';
import {UiService} from '../shared/ui.service';

@Injectable({providedIn: 'root'})
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated: boolean;

  constructor(private router: Router,
              private trainingService: TrainingService,
              private angularFireAuth: AngularFireAuth,
              private uiService: UiService) {
  }

  initAuthListener() {
    this.angularFireAuth.authState.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        this.isAuthenticated = false;
        this.authChange.next(false);
        this.router.navigate(['/login']);
      }
    });
  }

  registerUser(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);
    this.handleAuthResult(
      this.angularFireAuth.auth.createUserWithEmailAndPassword(authData.email, authData.password)
    );
  }

  login(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);
    this.handleAuthResult(
      this.angularFireAuth.auth.signInWithEmailAndPassword(authData.email, authData.password)
    );
  }

  private handleAuthResult(promise: Promise<firebase.auth.UserCredential>) {
    promise
      .then(result => {
        this.uiService.loadingStateChanged.next(false);
        console.log(result);
      })
      .catch(error => {
        this.uiService.loadingStateChanged.next(false);
        this.uiService.showSnackbar(error.message);
      });
  }

  logout() {
    this.angularFireAuth.auth.signOut();
  }

  isAuth() {
    return this.isAuthenticated;
  }
}
