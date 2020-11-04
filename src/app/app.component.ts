import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

// import {Use} from 'firebase';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'gimnasio';
  usuario: firebase.UserInfo;
  cargando: boolean = true;
  constructor(private auth: AngularFireAuth) {
    this.auth.user.subscribe((data) => {
      this.cargando = false;
      this.usuario = data;

    });

  }


}
