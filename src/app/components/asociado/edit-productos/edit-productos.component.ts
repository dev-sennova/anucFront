import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PersonasService } from 'src/app/services/personas.service';
import { ProduccionAsociadoService } from 'src/app/services/produccion-asociado.service';
import { ProductosCategoriasService } from 'src/app/services/productos-categorias.service';
import { UnidadesMedidaService } from 'src/app/services/unidades-medida.service';
import { PeriodicidadService } from 'src/app/services/periodicidad.service';
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-productos',
  templateUrl: './edit-productos.component.html',
  styleUrls: ['./edit-productos.component.css']
})
export class EditProductosComponent implements OnInit {

  asociado: any = {};
  produccionUnica: any[] = [];
  periodicidades: any[] = [];
  productos: any[] = [];
  unidadesDeMedida: any[] = [];
  showEditModal = false;
  showDeactivateModal = false;
  showActivateModal = false;
  showAddProductModal = false;
  selectedProduct: any = {};
  newProduct: any = {};

  constructor(
    private route: Router,
    private cdr: ChangeDetectorRef,
    private produccionService: PersonasService,
    private produccionAsociadoService: ProduccionAsociadoService,
    private productosSevice: ProductosCategoriasService,
    private periodicidadSevice: PeriodicidadService,
    private unidadesSevice: UnidadesMedidaService
  ) { }

  ngOnInit(): void {
    const asociadosFincaId = localStorage.getItem('identificador_asociado') || '';

    this.produccionService.getInfoOneAsociado(asociadosFincaId).subscribe(
      response => {
        if (response.estado === 'Ok') {
          this.asociado = response.asociado[0];
          this.eliminarDuplicados(response.produccion);
        }
      },
      error => {
        console.error('Error fetching data', error);
      }
    );

    this.productosSevice.getProductos().subscribe(
      (data) => {
        if (data) {
          this.productos = data;
        }
      },
      (error) => {
        console.error('Error al obtener los estados civiles:', error);
      }
    );

    this.unidadesSevice.getUnidades().subscribe(
      (data) => {
        if (data) {
          this.unidadesDeMedida = data;
        }
      },
      (error) => {
        console.error('Error al obtener los estados civiles:', error);
      }
    );

    this.periodicidadSevice.getPeriodicidades().subscribe(
      (data) => {
        if (data) {
          this.periodicidades = data;
        }
      },
      (error) => {
        console.error('Error al obtener los estados civiles:', error);
      }
    );

  }

  getPeriodicidad(id: number): string {
    const periodicidad = this.periodicidades.find((s) => s.id === id);
    return periodicidad ? periodicidad.periodicidad : '';
  }

  getProducto(id: number): string {
    const producto = this.productos.find((td) => td.id === id);
    return producto ? producto.producto : '';
  }

  getUnidadMedida(id: number): string {
    const medida_unidades = this.unidadesDeMedida.find((ec) => ec.id === id);
    return medida_unidades ? medida_unidades.unidad : '';
  }


  eliminarDuplicados(produccion: any[]): void {
    const seen = new Set();
    this.produccionUnica = produccion.filter(prod => {
      const duplicate = seen.has(prod.producto);
      seen.add(prod.producto);
      // Verificar y formatear la imagen base64
      if (prod.imagenProducto && !prod.imagenProducto.startsWith('data:')) {
        prod.imagenProducto = `data:image/jpeg;base64,${prod.imagenProducto}`;
      }
      return !duplicate;
    });
  }

  openEditModal(prod: any) {
    this.selectedProduct = { ...prod };
    this.showEditModal = true;
  }

  // Abrir modal para desactivar
  openDeactivateModal(prod: any) {
    this.selectedProduct = { ...prod };
    this.showDeactivateModal = true;
  }
  openActivateModal(prod: any) {
    this.selectedProduct = { ...prod };
    this.showActivateModal = true;
  }

  // Abrir modal para agregar nuevo producto
  openAddProductModal() {
    this.newProduct = {
      producto: '',
      produccion: '',
      medida: '',
      periodicidad: ''
    };
    this.showAddProductModal = true;
  }
  
  

  // Cerrar todos los modales
  closeModal() {
    this.showEditModal = false;
    this.showDeactivateModal = false;
    this.showAddProductModal = false;
    this.showActivateModal = false;
  }

  // Editar producto
  editarProducto() {
    const updatedProduct = {

        id: this.selectedProduct.idProduccion, 
        produccion: this.selectedProduct.produccion,
        periodicidad: this.selectedProduct.periodicidad, 
        producto: this.selectedProduct.idProducto, 
        medida: this.selectedProduct.medida, 
        asociados_finca: this.asociado.id 
    };

    this.produccionAsociadoService.updateProduccion(updatedProduct).subscribe(response => {
      Swal.fire('Guardado', 'El producto ha sido actualizado correctamente.', 'success');
      this.closeModal(); 
      this.ngOnInit();
    }, error => {
      Swal.fire('Error', 'Ocurrió un error al actualizar el producto.', 'error');
    });
}

  // Desactivar producto
  desactivarProducto() {
    this.produccionAsociadoService.deactivateProducciond(this.selectedProduct.idProduccion).subscribe(response => {
      Swal.fire('Desactivado', 'El producto ha sido desactivado.', 'success');
      this.closeModal();
      this.ngOnInit();
    }, error => {
      Swal.fire('Error', 'Ocurrió un error al desactivar el producto.', 'error');
    });
  }

  // Desactivar producto
  activarProducto() {
    this.produccionAsociadoService.activateProduccion(this.selectedProduct.idProduccion).subscribe(response => {
      Swal.fire('Activado', 'El producto ha sido activado.', 'success');
      this.closeModal();
      this.ngOnInit();
    }, error => {
      Swal.fire('Error', 'Ocurrió un error al activar el producto.', 'error');
    });
  }

  // Agregar nuevo producto
  agregarProducto() {
    const asociadosFincaId = localStorage.getItem('identificador_asociado') || '';
    this.newProduct.asociados_finca = asociadosFincaId; // Asegurarse de tener el ID del asociado
    this.produccionAsociadoService.addProduccion(this.newProduct).subscribe(response => {
      Swal.fire('Agregado', 'El nuevo producto ha sido agregado.', 'success');
      this.closeModal();
      this.ngOnInit();
    }, error => {
      Swal.fire('Error', 'Ocurrió un error al agregar el producto.', 'error');
    });
  }

}
