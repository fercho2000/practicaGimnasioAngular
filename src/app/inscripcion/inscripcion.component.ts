import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Cliente } from '../models/cliente';
import { Inscripcion } from '../models/inscripcion';
import { Precio } from '../models/precio';

@Component({
  selector: 'app-inscripcion',
  templateUrl: './inscripcion.component.html',
  styleUrls: ['./inscripcion.component.scss']
})
export class InscripcionComponent implements OnInit {

  inscripcion: Inscripcion = new Inscripcion();
  clienteSeleccionado: Cliente = new Cliente();
  precio: Precio[] = new Array<Precio>();
  precioSeleccionado: Precio = new Precio();
  formularioInscripcion: FormGroup;
  constructor(private db: AngularFirestore, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.db.collection('precios').get().subscribe((resultado) => {
      resultado.docs.forEach((item) => {
        let precio = item.data() as Precio;
        precio.id = item.id;
        precio.ref = item.ref;
        this.precio.push(precio);
      });
    });
  }
  asignarCliente(cliente: Cliente) {
    this.inscripcion.cliente = cliente.ref;
    console.log("object..", cliente);
    this.clienteSeleccionado = cliente;
  }

  eliminarCliente() {
    this.clienteSeleccionado = new Cliente();
    this.inscripcion.cliente = undefined;
  }
  guardar() {
    console.log("inscripcion..", this.inscripcion);
  }
  seleccionarPrecio(idPrecioSeleccionado: string) {
    if (idPrecioSeleccionado !== undefined && idPrecioSeleccionado !== "" && idPrecioSeleccionado !== null) {
      this.precioSeleccionado = this.precio.find(x => x.id === idPrecioSeleccionado);
      this.inscripcion.precio = this.precioSeleccionado.ref;
      this.inscripcion.subTotal = this.precioSeleccionado.costo;
      this.inscripcion.impuesto = this.inscripcion.subTotal * 0.15;
      this.inscripcion.total = this.inscripcion.subTotal + this.inscripcion.impuesto;
      this.inscripcion.fecha = new Date();
      if (this.precioSeleccionado.tipoDuracion === 1) {
        let dias: number = this.precioSeleccionado.duracion;
        let fechaFinal: Date = new Date(this.inscripcion.fecha.getFullYear(), this.inscripcion.fecha.getMonth(), this.inscripcion.fecha.getDate() + dias);
        this.inscripcion.fechaFinal = fechaFinal;
      }
      if (this.precioSeleccionado.tipoDuracion === 2) {
        let sieteDias: number = 7;
        let diasSemana: number = this.precioSeleccionado.duracion * sieteDias;
        let fechaFinal: Date = new Date(this.inscripcion.fecha.getFullYear(),
          this.inscripcion.fecha.getMonth(), this.inscripcion.fecha.getDate() + diasSemana);
        this.inscripcion.fechaFinal = fechaFinal;
      }

      if (this.precioSeleccionado.tipoDuracion === 3) {
        let quinceDias: number = 15;
        let diasQuincena: number = this.precioSeleccionado.duracion * quinceDias;
        let fechaFinal: Date = new Date(this.inscripcion.fecha.getFullYear(),
          this.inscripcion.fecha.getMonth(), this.inscripcion.fecha.getDate() + diasQuincena);
        this.inscripcion.fechaFinal = fechaFinal;
      }


      if (this.precioSeleccionado.tipoDuracion === 4) {

        let meses = this.precioSeleccionado.duracion + this.inscripcion.fecha.getMonth();

        let diasSemana: number = this.precioSeleccionado.duracion;
        let fechaFinal: Date = new Date(this.inscripcion.fecha.getFullYear(),
          this.inscripcion.fecha.getMonth() + meses, this.inscripcion.fecha.getDate() + diasSemana);
        this.inscripcion.fechaFinal = fechaFinal;
      }


      if (this.precioSeleccionado.tipoDuracion === 5) {
        let anio = this.inscripcion.fecha.getFullYear() + this.precioSeleccionado.duracion;
        let meses = this.precioSeleccionado.duracion + this.inscripcion.fecha.getMonth();

        let diasSemana: number = this.precioSeleccionado.duracion;
        let fechaFinal: Date = new Date(anio,
          this.inscripcion.fecha.getMonth() + meses, this.inscripcion.fecha.getDate() + diasSemana);
        this.inscripcion.fechaFinal = fechaFinal;
      }
    } else {
      this.inscripcion.precio = null;
      this.inscripcion.subTotal = 0;
      this.inscripcion.impuesto = 0;
      this.inscripcion.total = 0;
    }
  }
}
