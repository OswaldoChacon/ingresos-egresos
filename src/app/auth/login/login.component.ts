import { isLoading, stopLoading } from './../../shared/ui.actions';
import { AppState } from './../../app.reducer';
import { AuthService } from './../../services/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy {

  formLogin: FormGroup;
  cargando: boolean = false;
  uiSubscription: Subscription;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastrService,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.formLogin = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    this.uiSubscription = this.store.select('ui').subscribe(ui => {
      this.cargando = ui.isLoading;
      console.log("llll");
    });
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  login() {
    if (this.formLogin.invalid)
      return

    this.store.dispatch(isLoading())
    this.authService.login(this.formLogin.value)
      .then(usuario => {
        this.store.dispatch(stopLoading())
        this.router.navigate(['/dashboard']);
      })
      .catch(error => {
        this.store.dispatch(stopLoading())
        // this.toastService.error(error.message, 'Credenciales inválidas');
      })
      ;
  }

}
