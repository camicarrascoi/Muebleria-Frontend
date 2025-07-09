import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MaterialesService } from '../dashboard/services/materiales.service';
import { MueblesService } from './services/muebles.service';
import { ProveedoresService } from '../dashboard/services/proveedores.service';
import { VentaService } from '../dashboard/services/venta.service';
import { AuthService } from '../dashboard/services/auth.service';
import { PedidosService } from './services/pedido.service';

//inicio de iniciacion jeje

@Component({
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    selector: 'app-inicio',
    templateUrl: './inicio.component.html',
    styleUrls: ['./inicio.component.css'] 
})
export class InicioComponent implements OnInit {

    cantidadMuebles: number = 0;
    cantidadMateriales: number = 0;
    cantidadProveedores: number = 0;
    cantidadPedidos: number = 0;
    cantidadVentas: number = 0;

    mostrarResumen: boolean = false;

    constructor(
        private mueblesService: MueblesService,
        private materialesService: MaterialesService,
        private proveedoresService: ProveedoresService,
        private pedidosService: PedidosService,
        private ventaService: VentaService
    ) { }

    ngOnInit(): void {
        this.cargarResumen();
    }

    cargarResumen(): void {
        this.mueblesService.obtenerMuebles().subscribe(data => {
            this.cantidadMuebles = data.length;
            this.verificarMostrarResumen();
        });

        this.materialesService.obtenerMateriales().subscribe(data => {
            this.cantidadMateriales = data.length;
            this.verificarMostrarResumen();
        });

        this.proveedoresService.obtenerProveedores().subscribe(data => {
            this.cantidadProveedores = data.length;
            this.verificarMostrarResumen();
        });

        this.pedidosService.obtenerPedidos().subscribe(data => {
            this.cantidadPedidos = data.length;
            this.verificarMostrarResumen();
        });

        this.ventaService.obtenerVentas().subscribe(data => {
            this.cantidadVentas = data.length;
            this.verificarMostrarResumen();
        });
    }

    verificarMostrarResumen(): void {
        // Si ya cargaron todos, mostramos el resumen (puedes mejorar con un contador)
        if (
            this.cantidadMuebles !== 0 &&
            this.cantidadMateriales !== 0 &&
            this.cantidadProveedores !== 0 &&
            this.cantidadPedidos !== 0 &&
            this.cantidadVentas !== 0
        ) {
            this.mostrarResumen = true;
        }
    }

}