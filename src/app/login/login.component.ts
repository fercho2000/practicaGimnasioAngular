import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  formulario: FormGroup;
  datosCorrectos: boolean = true;
  textoError: string = "";
  constructor(private formBuilder: FormBuilder, private auth: AngularFireAuth,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required]
    });
  }

  ingresar() {
    if (this.formulario.valid) {
      this.datosCorrectos = true;
      this.spinner.show();
      this.auth.signInWithEmailAndPassword(this.formulario.value.email, this.formulario.value.password).then((usuario) => {
        console.log("Respuesta inicio sesión...", usuario);
        this.spinner.hide();
      }).catch((error) => {
        this.datosCorrectos = false;
        this.textoError = error.message;
        this.spinner.hide();
      });
    } else {
      this.datosCorrectos = false;
      this.textoError = " Revisa que los datos esten correctos!";
    }

  }
}
