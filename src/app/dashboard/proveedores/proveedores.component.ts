import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIf, NgForOf } from '@angular/common';
import { AuthService } from '../../dashboard/services/auth.service';
import { Proveedor, ProveedorMaterial } from '../../models/proveedores.model';
import { Material } from '../../models/material.model';
import { ProveedoresService } from '../../dashboard/services/proveedores.service';
import { MaterialesService } from '../../dashboard/services/materiales.service';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [CommonModule, NgForOf, NgIf, FormsModule],
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {
  proveedores: Proveedor[] = [];
  proveedorSeleccionado: Proveedor | null = null;
  mostrarFormulario = false;

  esAdmin = false;
  esUsuario = false;

  materialesDisponibles: Material[] = [];
  tiposMaterial: string[] = [];

  constructor(
    private proveedoresService: ProveedoresService,
    private materialesService: MaterialesService,
    private authService: AuthService
  ) { }

  // NUEVO Inicializamos los roles
  ngOnInit(): void {
    const rol = this.authService.getRole();
    this.esAdmin = rol === 'ADMIN';
    this.esUsuario = rol === 'USUARIO';

    this.cargarProveedores();
    this.cargarMateriales();

    this.materialesService.getTiposMaterial().subscribe({
      next: (tipos) => (this.tiposMaterial = tipos),
      error: (err) => console.error('Error al obtener tipos de material', err),
    });
  }


  soloNumeros(event: KeyboardEvent): void {
    const charCode = event.charCode || event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  cargarProveedores() {
    this.proveedoresService.obtenerProveedores().subscribe({
      next: data => {
        this.proveedores = data.map(p => ({
          ...p,
          //fechaPedido: typeof p.fechaPedido === 'string' && p.fechaPedido
          // ? this.parseFechaDDMMYYYY(p.fechaPedido)
          //: p.fechaPedido  // ya es Date o undefined
        }));
      },
      error: err => console.error('Error al obtener proveedores', err)
    });
  }

 

  cargarMateriales() {
    this.materialesService.obtenerMateriales().subscribe({
      next: data => {
        this.materialesDisponibles = data;
      },
      error: err => console.error('Error al cargar materiales', err)
    });
  }
  getMaterialNombre(id: number | null | undefined): string {
    if (id == null) return '';
    const m = this.materialesDisponibles.find(mat => mat.id === id);
    return m ? m.nombre : '';
  }
  abrirFormularioNuevo() {
  this.proveedorSeleccionado = {
    nombre: '',
    telefono: '',
    correo: '',
    direccion: '',
    proveedorMateriales: [
      {
        costoUnitario: 0,
        cantidadSuministrada: 0,
        material: {
          nombre: '',
          tipo: '',
          descripcion: '',
          unidadDeMedida: ''
        } as any
      }
    ]
  } as Proveedor;
  this.mostrarFormulario = true;
}

editarProveedor(proveedor: Proveedor) {
  this.proveedorSeleccionado = {
    ...proveedor,
    proveedorMateriales: proveedor.proveedorMateriales ? [...proveedor.proveedorMateriales] : []
  };
  this.mostrarFormulario = true;
}

guardarProveedor() {
  if (!this.proveedorSeleccionado) return;

  const isEdit = !!this.proveedorSeleccionado.id;

  // Validación mínima para materiales
const invalido = (this.proveedorSeleccionado.proveedorMateriales || []).some(pm => {
  if (!pm.material) return true;

  if (isEdit) {
    if (!pm.material.id) return true;
  } else {
    if (
      !pm.material.nombre?.trim() ||
      !pm.material.tipo?.trim() ||
      !pm.material.descripcion?.trim() ||
      !pm.material.unidadDeMedida?.trim()
    ) return true;
  }

    if (pm.costoUnitario == null || pm.costoUnitario < 0) return true;

    return false;
  });

  if (invalido) {
    alert('Por favor completa todos los campos de material correctamente.');
    return;
  }

  const body: any = {
  nombre: this.proveedorSeleccionado.nombre?.trim(),
  telefono: this.proveedorSeleccionado.telefono?.trim(),
  correo: this.proveedorSeleccionado.correo?.trim(),
  direccion: this.proveedorSeleccionado.direccion?.trim(),
  proveedorMateriales: this.proveedorSeleccionado.proveedorMateriales!.map(pm => {
    const costoInt = Math.round(pm.costoUnitario);
    // Asegura cantidadSuministrada, mínimo 0 si no existe
    const cantidadInt = pm.cantidadSuministrada != null ? Math.round(pm.cantidadSuministrada) : 0;

    if (pm.id) {
      // Relación ya existente, envia id, costo, cantidad y material id
      return {
        id: pm.id,
        costoUnitario: costoInt,
        cantidadSuministrada: cantidadInt,
        material: { id: pm.material.id }
      };
    } else {
      // Relación nueva, solo envía costo y material con id (porque dices que lo seleccionas de un select)
      return {
        costoUnitario: costoInt,
        cantidadSuministrada: cantidadInt,
        material: { id: pm.material.id }
      };
    }
  })
};

  console.log('Payload proveedor:', JSON.stringify(body, null, 2));

  const llamada = isEdit
    ? this.proveedoresService.editarProveedor(this.proveedorSeleccionado.id!, body)
    : this.proveedoresService.agregarProveedor(body);

  llamada.subscribe({
    next: () => {
      this.cargarProveedores();
      this.cancelarFormulario();
    },
    error: err => {
      console.error('Error al guardar proveedor:', err);
      alert('Ocurrió un error al guardar el proveedor.');
    }
  });
}



  eliminarProveedor(id: number) {
    // mostramos el confirm y capturamos la respuesta
    const confirmado = window.confirm('¿Estás seguro de eliminar este proveedor?');

    if (!confirmado) {
      // si el usuario presiona “Cancelar”
      window.alert('Eliminación cancelada.');
      return;
    }

    // si presionó “Aceptar”, llamamos al servicio…
    this.proveedoresService.eliminarProveedor(id).subscribe({
      next: () => {
        // recargamos lista y cerramos formulario
        this.cargarProveedores();
        this.mostrarFormulario = false;
        this.proveedorSeleccionado = null;
        window.alert('Proveedor eliminado correctamente.');
      },
      error: err => {
        console.error('Error al eliminar proveedor', err);
        window.alert('Ocurrió un error al eliminar el proveedor.');
      }
    });
  }

  cancelarFormulario() {
    this.mostrarFormulario = false;
    this.proveedorSeleccionado = null;
  }

  agregarMaterial() {
    if (this.proveedorSeleccionado) {
      this.proveedorSeleccionado.proveedorMateriales = this.proveedorSeleccionado.proveedorMateriales || [];
      this.proveedorSeleccionado.proveedorMateriales.push({
        material: {
          id: 0,
          nombre: '',
          tipo: '',
          descripcion: '',
          unidadDeMedida: '',
          stockActual: 0
        },
        cantidadSuministrada: 0,
        costoUnitario: 0
      });
    }
  }

  quitarMaterial(index: number) {
    if (this.proveedorSeleccionado?.proveedorMateriales) {
      this.proveedorSeleccionado.proveedorMateriales.splice(index, 1);
    }
  }

  // Cambiamos para recibir índice y nuevo id y actualizar el material completo
  onMaterialChange(index: number, nuevoIdStr: string) {
    const nuevoId = Number(nuevoIdStr);
    const material = this.materialesDisponibles.find(m => m.id === nuevoId);
    if (material && this.proveedorSeleccionado?.proveedorMateriales) {
      this.proveedorSeleccionado.proveedorMateriales[index].material = {
        id: material.id!,
        nombre: material.nombre,
        tipo: material.tipo,
        descripcion: material.descripcion,
        unidadDeMedida: material.unidadDeMedida,
        stockActual: material.stockActual,
      };
    }
  }
}
