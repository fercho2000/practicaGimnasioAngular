import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { MensajesService } from '../services/mensajes.service';
@Component({
  selector: 'app-agregar-cliente',
  templateUrl: './agregar-cliente.component.html',
  styleUrls: ['./agregar-cliente.component.scss']
})
export class AgregarClienteComponent implements OnInit {

  formularioCliente: FormGroup;
  porcentajeDeSubida: number = 0;
  urlImagen: string = '';
  esEditable: boolean = false;
  idCliente: string = '';
  constructor(private formBuilder: FormBuilder, private storage: AngularFireStorage,
    private db: AngularFirestore, private activeRout: ActivatedRoute, private mensaje: MensajesService) { }

  ngOnInit(): void {

    this.formularioCliente = this.formBuilder.group(
      {
        nombre: ['', Validators.required],
        apellido: ['', Validators.required],
        correo: ['', Validators.compose([Validators.required, Validators.email])],
        cedula: [''],
        fechaNacimiento: ['', Validators.required],
        telefono: [''],
        imgUrl: ['', Validators.required]
      }
    );

    this.idCliente = this.activeRout.snapshot.params.clienteID;
    if (this.idCliente !== undefined) {
      this.esEditable = true;
      this.db.doc<any>(`clientes/${this.idCliente}`).valueChanges().subscribe((datosCliente) => {
        this.formularioCliente.setValue({
          nombre: datosCliente.nombre,
          apellido: datosCliente.apellido,
          correo: datosCliente.correo,
          fechaNacimiento: new Date(datosCliente.fechaNacimiento.seconds * 1000).toISOString().substr(0, 10),
          telefono: datosCliente.telefono,
          cedula: datosCliente.cedula,
          imgUrl: ''
        });

        this.urlImagen = datosCliente.imgUrl;
      });
    }
  }

  agregarCliente() {
    this.formularioCliente.value.imgUrl = this.urlImagen;
    this.formularioCliente.value.fechaNacimiento = new Date(this.formularioCliente.value.fechaNacimiento);
    this.db.collection('clientes').add(this.formularioCliente.value).then(() => {
      this.mensaje.mensajeDeExito('Agregado', 'Agregado correctamente');

      this.formularioCliente.reset();
    });
  }

  editarCliente() {
    this.formularioCliente.value.imgUrl = this.urlImagen;
    this.formularioCliente.value.fechaNacimiento = new Date(this.formularioCliente.value.fechaNacimiento);
    this.db.doc<any>(`clientes/${this.idCliente}`).update(this.formularioCliente.value).then(() => {
      this.mensaje.mensajeDeExito('Editado', 'Editado correctamente');
    }).catch(() => {
      this.mensaje.mensajeError('Error', 'Error al actualizar');
    });
  }

  subirImagen(evento) {
    if (evento.target.files.length > 0) {
      const nombreArchivo = new Date().getTime().toString();
      const archivo = evento.target.files[0];
      const extensionArchivo = archivo.name.toString().substring(archivo.name.toString().lastIndexOf('.'));
      const ruta = `clientes/${nombreArchivo}${extensionArchivo}`;
      const referencia = this.storage.ref(ruta);
      const tarea = referencia.put(archivo);
      tarea.then((respuesta) => {
        if (respuesta.state == "success") {
          referencia.getDownloadURL().subscribe((url) => {
            this.urlImagen = url;
          });
        }

      });
      tarea.percentageChanges().subscribe((porcentaje) => {
        this.porcentajeDeSubida = parseInt(porcentaje.toString());
      });
    }

  }
}
