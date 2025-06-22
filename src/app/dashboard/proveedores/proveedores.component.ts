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

  constructor(
    private proveedoresService: ProveedoresService,
    private materialesService: MaterialesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarProveedores();
    this.cargarMateriales();
    const rol = this.authService.getRole();
    this.esAdmin = rol === 'admin';
    this.esUsuario = rol === 'usuario';
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
        console.log('Proveedores recibidos:', data);
        this.proveedores = data;
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

  abrirFormularioNuevo() {
    this.proveedorSeleccionado = {
      nombre: '',
      direccion: '',
      correo: '',
      telefono: '',
      proveedorMateriales: []
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

    // Validar que todos los materiales tengan id válido
    const tieneMaterialInvalido = this.proveedorSeleccionado.proveedorMateriales?.some(pm => !pm.material?.id || pm.material.id === 0);

    if (tieneMaterialInvalido) {
      alert('Por favor selecciona un material válido para todos los elementos.');
      return;
    }

      // Formateo manual de fecha a dd/MM/yyyy
    let fechaFormateada: string | undefined;
    if (this.proveedorSeleccionado.fechaPedido) {
    const f = new Date(this.proveedorSeleccionado.fechaPedido);
    const dd = f.getDate().toString().padStart(2, '0');
    const mm = (f.getMonth() + 1).toString().padStart(2, '0');
    const yyyy = f.getFullYear();
    fechaFormateada = `${dd}/${mm}/${yyyy}`;
  }

    const body: any = {
    // Si tu ProveedorDTO lleva nombre, teléfono, etc., mantenlos:
    nombre: this.proveedorSeleccionado.nombre,
    telefono: this.proveedorSeleccionado.telefono,
    correo: this.proveedorSeleccionado.correo,
    direccion: this.proveedorSeleccionado.direccion,
    fechaPedido: fechaFormateada,
    proveedorMateriales: this.proveedorSeleccionado.proveedorMateriales!.map(pm => ({
      // sólo incluyes el id de la relación si existe (para PUT)
      ...(pm.id != null ? { id: pm.id } : {}),
      costoUnitario: pm.costoUnitario,
      // **Renombramos** la cantidad
      cantidadSuministrada: pm.cantidadSolicitada,
      // anidamos sólo el id del material
      material: { id: pm.material.id }
    }))
  };

    const operacion = this.proveedorSeleccionado.id
      ? this.proveedoresService.editarProveedor(this.proveedorSeleccionado.id, body)
      : this.proveedoresService.agregarProveedor(body);

    operacion.subscribe({
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
        material: { id: 0, nombre: '', tipo: '', descripcion: '', unidadDeMedida: '', stockActual: 0, proveedorMateriales: [], materialMuebles: [] },
        cantidadSolicitada: 0,
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
      this.proveedorSeleccionado.proveedorMateriales[index].material = material;
    }
  }
}
