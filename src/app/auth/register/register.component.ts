import { Router, Routes } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {

  formRegistro: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.formRegistro = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    })
  }

  crearUsuario() {
    if (this.formRegistro.invalid)
      return;
    this.authService.crearUsuario(this.formRegistro.value)
      .then(credenciales => {
        this.router.navigate(['/dashboard'])        
      })
      .catch(error => {
        console.error(error);
      });
    ;
  }

}
