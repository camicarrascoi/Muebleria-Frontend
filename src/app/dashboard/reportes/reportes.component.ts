import { Component } from '@angular/core';
import { ReporteService } from '../../dashboard/services/reportes.service';

@Component({
  selector: 'app-reportes',
  standalone: true,
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css'],
  imports: []
})
export class ReportesComponent {

  constructor(private reporteService: ReporteService) {}

  descargar() {
    this.reporteService.descargarReporteCompleto().subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ReporteCompleto.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    }, error => {
      alert('Error al descargar el reporte');
      console.error(error);
    });
  }
}