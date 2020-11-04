import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
@Component({
  selector: 'app-listado-clientes',
  templateUrl: './listado-clientes.component.html',
  styleUrls: ['./listado-clientes.component.scss']
})
export class ListadoClientesComponent implements OnInit {

  clientes: any[] = new Array<any>();

  constructor(private db: AngularFirestore) {

  }

  ngOnInit(): void {
    // this.db.collection('clientes').valueChanges().subscribe((datos) => {
    //   this.clientes = datos;
    //   console.log("resultado...", datos);
    // });

    this.clientes.length = 0;
    this.db.collection('clientes').get().subscribe((data) => {
      console.log("resultado...", data.docs);

      data.docs.forEach((iterator) => {
        // console.log("ids..", iterator.id);
        // console.log("data...", iterator.data());
        // console.log("referencia..", iterator.ref);
        let cliente = iterator.data();
        cliente.id = iterator.id;
        cliente.ref = iterator.ref;
        this.clientes.push(cliente);
      });

    });
  }

}
