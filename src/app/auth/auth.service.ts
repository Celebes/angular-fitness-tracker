import {Injectable} from '@angular/core';
import {AuthData} from './auth-data.model';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {TrainingService} from '../training/training.service';
import {UiService} from '../shared/ui.service';
import {Store} from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as UiActions from '../shared/ui.actions';
import * as AuthActions from '../auth/store/auth.actions';

@Injectable({providedIn: 'root'})
export class AuthService {

  constructor(private router: Router,
              private trainingService: TrainingService,
              private angularFireAuth: AngularFireAuth,
              private store: Store<fromApp.State>,
              private uiService: UiService) {
  }

  initAuthListener() {
    this.angularFireAuth.authState.subscribe(user => {
      if (user) {
        this.store.dispatch(AuthActions.setAuthenticated());
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        this.store.dispatch(AuthActions.setUnauthenticated());
        this.router.navigate(['/login']);
      }
    });
  }

  registerUser(authData: AuthData) {
    this.store.dispatch(UiActions.startLoading());
    this.handleAuthResult(
      this.angularFireAuth.auth.createUserWithEmailAndPassword(authData.email, authData.password)
    );
  }

  login(authData: AuthData) {
    this.store.dispatch(UiActions.startLoading());
    this.handleAuthResult(
      this.angularFireAuth.auth.signInWithEmailAndPassword(authData.email, authData.password)
    );
  }

  private handleAuthResult(promise: Promise<firebase.auth.UserCredential>) {
    promise
      .then(result => {
        this.store.dispatch(UiActions.stopLoading());
        console.log(result);
      })
      .catch(error => {
        this.store.dispatch(UiActions.stopLoading());
        this.uiService.showSnackbar(error.message);
      });
  }

  logout() {
    this.angularFireAuth.auth.signOut();
  }
}
