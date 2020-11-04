import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Precio } from '../models/precio';
import { MensajesService } from '../services/mensajes.service';

@Component({
  selector: 'app-precios',
  templateUrl: './precios.component.html',
  styleUrls: ['./precios.component.scss']
})
export class PreciosComponent implements OnInit {

  formularioPrecio: FormGroup;
  listaPrecios: Precio[] = new Array<Precio>();
  esEditar: boolean = false;
  idPrecio: string;
  constructor(private formBuilder: FormBuilder, private db: AngularFirestore, private mensaje: MensajesService) { }

  ngOnInit(): void {
    this.formularioPrecio = this.formBuilder.group({
      nombre: ['', Validators.required],
      costo: ['', Validators.required],
      duracion: ['', Validators.required],
      tipoDuracion: ['', Validators.required]
    });
    this.mostrarPrecios();
  }

  agregar() {
    this.db.collection('precios').add(this.formularioPrecio.value).then(() => {
      this.mensaje.mensajeDeExito("Agregado", "Se agrego correctamente!");
      this.formularioPrecio.reset();
      this.mostrarPrecios();
    }).catch(() => {
      this.mensaje.mensajeError("Error", "Ocurrio un error al guardar!");
    });
  }
  editarPrecio(precio: Precio) {
    this.esEditar = true;
    this.formularioPrecio.setValue({
      nombre: precio.nombre,
      costo: precio.costo,
      duracion: precio.duracion,
      tipoDuracion: precio.tipoDuracion
    });
    this.idPrecio = precio.id;
  }

  editar() {
    this.db.doc(`precios/${this.idPrecio}`).update(this.formularioPrecio.value).then(() => {
      this.mensaje.mensajeDeExito("Actualizar", "Se actualizo el precio de manera correcta!");
      this.formularioPrecio.reset();
      this.esEditar = false;
    }).catch(() => {
      this.mensaje.mensajeError("Error", "Error al actualizar");
    });

    this.mostrarPrecios();
  }

  mostrarPrecios() {

    this.db.collection<Precio>('precios').get().subscribe((respuesta) => {
      this.listaPrecios.length = 0;
      respuesta.docs.forEach((valor) => {
        const precio = valor.data() as Precio;
        precio.id = valor.id;
        precio.ref = valor.ref;
        this.listaPrecios.push(precio);
      });
    });
  }

}
