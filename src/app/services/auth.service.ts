import { Usuario } from './../models/usuario.model';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { AppState } from '../app.reducer';
import { setUser, unSetUser } from '../auth/auth.actions';
import { Subscription } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription: Subscription;
  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private store: Store<AppState>
  ) { }

  crearUsuario(usuario: any) {
    const { email, password, nombre } = usuario;
    return this.auth.createUserWithEmailAndPassword(email, password)
      .then(({ user }) => {
        const newUser = new Usuario(user.uid, nombre, user.email);
        return this.firestore.doc(`${user.uid}/usuario`).set({ ...newUser })
      })
  }


  login(usuario: any) {
    const { email, password } = usuario;
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.auth.signOut();
  }

  initAuthListener() {
    this.auth.authState.subscribe(firebaseUser => {
      if (firebaseUser) {
        this.userSubscription = this.firestore.doc(`${firebaseUser.uid}/usuario`).valueChanges().subscribe((firestoreUser: any) => {
          const user = Usuario.fromFirebase(firestoreUser);
          this.store.dispatch(setUser({ user }));
        })
      }
      else {
        this.userSubscription.unsubscribe()
        this.store.dispatch(unSetUser());
      }
    })
  }

  isAuth() {
    return this.auth.authState.pipe(
      map(firebaseUser => firebaseUser != null
      )
    )
  }
}
