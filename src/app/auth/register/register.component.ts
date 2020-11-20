import { isLoading, stopLoading } from './../../shared/ui.actions';
import { Router, Routes } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {

  cargando: boolean = false;
  uiSubscription: Subscription;
  formRegistro: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {

    this.formRegistro = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.uiSubscription = this.store.select('ui').subscribe(ui => this.cargando = ui.isLoading)
  }
  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe()
  }

  crearUsuario() {
    if (this.formRegistro.invalid)
      return;
    this.store.dispatch(isLoading());    
    this.authService.crearUsuario(this.formRegistro.value)
      .then(credenciales => {
        this.store.dispatch(stopLoading());    
        this.router.navigate(['/dashboard'])
      })
      .catch(error => {
        console.error(error);
      });
    ;
  }

}
