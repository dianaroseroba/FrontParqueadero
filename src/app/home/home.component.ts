import { Component } from '@angular/core';
import { ApiConection } from "../Shared/ApiConection";
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from "primeng/api";
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from "primeng/inputtext";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MenubarModule,
    TableModule,
    ButtonModule,
    DialogModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  formParqueadero: FormGroup;
  formTarifa: FormGroup;
  items: MenuItem[] | undefined;
  parqueaderos: any[] = [];
  verFormParqueadero: boolean = false;
  selectedParqueadero: any = {};

  constructor(private api: ApiConection, private fb: FormBuilder) {
    this.api.token = localStorage.getItem('token');
    this.formParqueadero = this.fb.group({
      id: [''],
      nombre: ['', Validators.required],
      nit: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required]
    });
    this.formTarifa = this.fb.group({
      id: [''],
      parqueadero_id: ['', Validators.required],
      tamano: ['', Validators.required],
      precio: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home'
      },
    ];
    this.listaParqueaderos();
  }

  // Lista los parqueaderos
  listaParqueaderos() {
    console.log(this.api.token);
    this.api.get('parqueadero')
      .subscribe(data => {
        this.parqueaderos = data;
      });
  }

  // Acción para agregar o actualizar un parqueadero
  accionFormularioParqueadero() {
    if (this.formParqueadero.value['id']) {
      this.updateParqueadero();
    } else {
      this.addParqueadero();
    }
  }

  // Agrega un nuevo parqueadero
  addParqueadero() {
    this.api.add('parqueadero/', this.formParqueadero.value)
      .subscribe(data => {
        this.listaParqueaderos();
        this.verFormParqueadero = false;
        this.formParqueadero.reset();
      });
  }

  // Actualiza un parqueadero
  updateParqueadero() {
    this.api.update('parqueadero', this.formParqueadero.value, this.selectedParqueadero.id)
      .subscribe(data => {
        this.listaParqueaderos();
        this.verFormParqueadero = false;
        this.formParqueadero.reset();
      });
  }

  // Selecciona un parqueadero para editar
  seleccionarParqueadero(parqueadero: any) {
    this.selectedParqueadero = parqueadero;
    this.formParqueadero.patchValue(this.selectedParqueadero); // Cargar los valores del parqueadero en el formulario
    this.verFormParqueadero = true; // Mostrar el formulario para editar
  }

  // Elimina un parqueadero con confirmación
  deleteParqueadero(id: number) {
    if (confirm("¿Estás seguro de que deseas eliminar este parqueadero?")) { // Confirmación antes de eliminar
      this.api.delete('parqueadero', id)
        .subscribe(data => {
          this.listaParqueaderos(); // Actualiza la lista después de eliminar
          console.log("Parqueadero eliminado");
        }, error => {
          console.error("Error al eliminar el parqueadero", error);
        });
    }
  }

  // Cancela el formulario
  cancel() {
    this.formParqueadero.reset();
    this.verFormParqueadero = false;
    this.selectedParqueadero = {};
  }
}
