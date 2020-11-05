import { DocumentReference } from '@angular/fire/firestore';

export class Inscripcion {
    fecha: Date;
    fechaFinal: Date;
    cliente: DocumentReference;
    precio: DocumentReference;
    subTotal: number;
    impuesto: number;
    total: number;
    constructor() {
        this.fecha = null;
        this.fechaFinal = null;
        this.cliente = null;
        this.precio = null;
        this.subTotal = null;
        this.impuesto = null;
        this.total = null;
    }
}
