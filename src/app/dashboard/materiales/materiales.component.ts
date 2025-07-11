import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { NgIf, NgForOf } from '@angular/common';
import { Material, ProveedorSimple } from '../../models/material.model';
import { MaterialesService } from '../services/materiales.service';
import { AuthService } from '../services/auth.service';
import { ProveedoresService } from '../services/proveedores.service';
import { Proveedor } from '../../models/proveedores.model';

@Component({
  selector: 'app-materiales',
  standalone: true,
  imports: [CommonModule, NgIf, NgForOf, FormsModule],
  templateUrl: './materiales.component.html',
  styleUrls: ['./materiales.component.css'],
})
export class MaterialesComponent implements OnInit {
  materiales: Material[] = [];
  proveedores: Proveedor[] = [];
  proveedoresSeleccionados: Proveedor[] = [];
  materialSeleccionado: Material | null = null;
  proveedoresDisponibles: Proveedor[] = [];
  mostrarFormulario = false;
  esAdmin = false;
  esUsuario = false;
  tiposMaterial: string[] = [];

  constructor(
    private materialesService: MaterialesService,
    private proveedoresService: ProveedoresService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.cargarMateriales();
    this.cargarProveedores();
    this.materialesService.getTiposMaterial().subscribe({
      next: (tipos) => (this.tiposMaterial = tipos),
      error: (err) => console.error('Error al obtener tipos de material', err),
    });
    const rol = this.authService.getRole();
    this.esAdmin = rol === 'ADMIN';
    this.esUsuario = rol === 'USUARIO';

  }

  cargarProveedores(): void {
    this.proveedoresService.obtenerProveedores().subscribe({
      next: (provData) => {
        this.proveedores = provData;
        this.cargarMateriales();
      },
      error: (err) => console.error('Error al cargar proveedores', err),
    });
  }

cargarMateriales(): void {
  this.materialesService.obtenerMateriales().subscribe({
    next: (data) => {
      this.materiales = data.map((material: any) => {
        const proveedorMateriales = (material.proveedorMateriales || []).map((prov: any) => ({
          id: prov.id,
          nombreProveedor: prov.nombreProveedor || 'Sin nombre',
          costoUnitario: prov.costoUnitario ?? 0,
          cantidadSuministrada: prov.cantidadSuministrada ?? 0
        }));

        const materialMuebles = (material.materialMuebles || []).map((mm: any) => ({
          id: mm.id,
          cantidadUtilizada: mm.cantidadUtilizada ?? 'N/A',
          muebleNombre: mm.nombreMueble || 'Sin mueble',
        }));

        return {
          id: material.id,
          nombre: material.nombre,
          tipo: material.tipo,
          descripcion: material.descripcion,
          unidadDeMedida: material.unidadDeMedida,
          stockActual: material.stockActual,
          proveedorMateriales,
          materialMuebles,
        };
      });
    },
    error: (err) => console.error('Error al cargar materiales', err),
  });
}

  //metodo nuevo QUE PIDIO EL PROFE
  toggleProveedorSeleccionado(proveedor: Proveedor, event: Event): void {
    const input = event.target as HTMLInputElement;
    const seleccionado = input.checked;

    if (seleccionado) {
      if (!this.proveedoresSeleccionados.some(p => p.id === proveedor.id)) {
        this.proveedoresSeleccionados.push(proveedor);
      }
    } else {
      this.proveedoresSeleccionados = this.proveedoresSeleccionados.filter(p => p.id !== proveedor.id);
    }
  }

  isProveedorSeleccionado(proveedorId: number | null | undefined): boolean {
    if (proveedorId == null) return false; // cubre null y undefined
    return this.proveedoresSeleccionados.some(p => p.id === proveedorId);
  }

  //fin a lo que pidio el profe

  abrirFormularioNuevo(): void {
    this.materialSeleccionado = {
      id: null,
      nombre: '',
      tipo: '',
      descripcion: '',
      unidadDeMedida: '',
      stockActual: 0,
      proveedorMateriales: [],
      materialMuebles: [],
    };
    this.proveedoresSeleccionados = [];
    this.mostrarFormulario = true;
  }

  editarMaterial(material: Material): void {
  this.materialSeleccionado = { ...material };  // copia del material para editar
  // Cargar proveedores seleccionados para el formulario (solo UI)
  this.proveedoresSeleccionados = this.proveedores.filter(p =>
    material.proveedorMateriales.some(pm => pm.id === p.id)
  );
  this.mostrarFormulario = true;
}

  // Bloquea teclas no válidas para campos de solo letras
  soloLetras(event: KeyboardEvent): void {
    const char = event.key;
    const letrasRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]$/;
    if (!letrasRegex.test(char)) {
      event.preventDefault();
    }
  }

  // Bloquea teclas no válidas para campos numéricos
  soloNumeros(event: KeyboardEvent): void {
    const char = event.key;
    const numerosRegex = /[0-9]/;
    if (!numerosRegex.test(char)) {
      event.preventDefault();
    }
  }

  // También validamos antes de guardar, por seguridad
  validarSoloLetras(texto: string): boolean {
    const letrasRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/;
    return letrasRegex.test(texto);
  }

  validarSoloNumeros(valor: any): boolean {
    const numeroRegex = /^\d+$/;
    return numeroRegex.test(String(valor));
  }

guardarMaterial(form: NgForm): void {
  console.log('guardarMaterial llamado');
  //if (form.invalid) {
    //form.control.markAllAsTouched();
    //return;
  //}

  if (!this.materialSeleccionado) {
    console.log('materialSeleccionado es null');
    return;
  }

  console.log('Datos a guardar:', this.materialSeleccionado);
  //if (
    //!this.validarSoloLetras(this.materialSeleccionado.nombre) ||
    //!this.validarSoloLetras(this.materialSeleccionado.descripcion)
  //) {
    //alert('Nombre y descripción deben contener solo letras y espacios.');
    //return;
  //}

  if (!this.validarSoloNumeros(this.materialSeleccionado.stockActual)) {
    alert('Stock debe ser un número válido.');
    return;
  }

  // Solo estos campos según el backend
  const materialParaGuardar = {
    nombre: this.materialSeleccionado.nombre,
    tipo: this.materialSeleccionado.tipo,
    descripcion: this.materialSeleccionado.descripcion,
    unidadDeMedida: this.materialSeleccionado.unidadDeMedida,
    stockActual: this.materialSeleccionado.stockActual,
  };

  console.log('Material para enviar:', materialParaGuardar);

  if (this.materialSeleccionado.id) {
    this.materialesService.editarMaterial(this.materialSeleccionado.id, materialParaGuardar).subscribe({
      next: () => {
        this.cargarMateriales();
        this.cancelarFormulario();
      },
      error: (err) => console.error('Error al actualizar material', err),
    });
  } else {
    this.materialesService.agregarMaterial(materialParaGuardar).subscribe({
      next: () => {
        this.cargarMateriales();
        this.cancelarFormulario();
      },
      error: (err) => console.error('Error al crear material', err),
    });
  }
}

  eliminarMaterial(id: number): void {
    if (confirm('¿Estás segura de que deseas eliminar este material?')) {
      this.materialesService.eliminarMaterial(id).subscribe({
        next: () => this.cargarMateriales(),
        error: (err) => console.error('Error al eliminar material', err),
      });
    }
  }

  cancelarFormulario(): void {
    this.mostrarFormulario = false;
    this.materialSeleccionado = null;
  }
}
