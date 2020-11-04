import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-agregar-cliente',
  templateUrl: './agregar-cliente.component.html',
  styleUrls: ['./agregar-cliente.component.scss']
})
export class AgregarClienteComponent implements OnInit {

  formularioCliente: FormGroup;
  porcentajeDeSubida: number = 0;
  constructor(private formBuilder: FormBuilder, private storage: AngularFireStorage) { }

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
  }

  agregarCliente() {

    
  }

  subirImagen(evento) {
    let nombreArchivo = new Date().getTime().toString();
    const archivo = evento.target.files[0];
    const extensionArchivo = archivo.name.toString().substring(archivo.name.toString().lastIndexOf('.'));
    const ruta = `clientes/${nombreArchivo}${extensionArchivo}`;
    const referencia = this.storage.ref(ruta);
    const tarea = referencia.put(archivo);
    tarea.then((respuesta) => {
      if (respuesta.state === "success") {
        referencia.getDownloadURL().subscribe((url) => {
          console.log("url imagen....", url);
        });
      }

    });
    tarea.percentageChanges().subscribe((porcentaje) => {
      this.porcentajeDeSubida = parseInt(porcentaje.toString());
    });

  }
}
