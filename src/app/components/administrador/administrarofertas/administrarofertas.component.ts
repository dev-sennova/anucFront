import { Component, OnInit } from '@angular/core';
import { OfertasAsociadoService } from 'src/app/services/ofertas-asociado.service';
import { ProductosCategoriasService } from 'src/app/services/productos-categorias.service';
import { UnidadesMedidaService } from 'src/app/services/unidades-medida.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-administrarofertas',
  templateUrl: './administrarofertas.component.html',
  styleUrls: ['./administrarofertas.component.css']
})
export class AdministrarofertasComponent implements OnInit {

  ofertas: any[] = [];
  todasOfertas: any[] = [];
  categorias: any[] = [];
  productos: any[] = [];
  unidades: any[] = [];
  ofertasFiltradas: any[] = [];
  searchTerm: string = '';
  selectedCategoria: string = '';
  selectedProducto: string = '';
  filtersVisible: boolean = false;
  imageModalVisible: boolean = false;
  imagenOfertaUrl: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  paginatedOfertas: any[] = [];

  constructor(private ofertasService: OfertasAsociadoService,
    private categoriasService: ProductosCategoriasService,
    private unidadesService: UnidadesMedidaService
  ) { }

  ngOnInit(): void {
    this.cargarOfertas();
  }

  cargarOfertas(): void {
    this.ofertasService.getOfertaPublicas().subscribe(
      data => {
        if (data) {
          this.todasOfertas = data.ofertas;
          this.ofertas = [...this.todasOfertas];
          this.ofertasFiltradas = this.ofertas;
          this.updatePagination();
        }
      },
      error => {
        Swal.fire('Error', 'Error al obtener las ofertas', 'error');
      }
    );

    this.categoriasService.getCategorias().subscribe(
      data => {
        if (data) {
          this.categorias = data;
        }
      },
      error => {
        Swal.fire('Error', 'Error al obtener las ofertas', 'error');
      }
    );

    this.categoriasService.getProductos().subscribe(
      data => {
        if (data) {
          this.productos = data;
        }
      },
      error => {
        Swal.fire('Error', 'Error al obtener las ofertas', 'error');
      }
    );

    this.unidadesService.getUnidades().subscribe(
      data => {
        if (data) {
          this.unidades = data;
        }
      },
      error => {
        Swal.fire('Error', 'Error al obtener las ofertas', 'error');
      }
    );
  }

  getProductoNombre(id: number): string {
    const producto = this.productos.find(prod => prod.id === id);
    console.log('Producto encontrado para ID:', id, producto);
    return producto ? producto.producto : 'Producto no encontrado';
  }

  getCategoriaId(productId: number): string {
    const producto = this.productos.find(prod => prod.id === productId);
    return producto ? producto.categoria_id.toString() : '';
  }

  getUnidadNombre(unidadId: number): string {
    const unidad = this.unidades.find(unid => unid.id === unidadId);
    return unidad ? unidad.unidad : '';
  }

  getCategoriaNombre(categoriaid: number): string {
    const categoria = this.categorias.find(cat => cat.id === categoriaid);
    return categoria ? categoria.categoria : '';
  }

  getEstado(estado: number): string {
    return estado === 1 ? 'Activo' : 'Inactivo';
  }

  buscar(): void {
    this.ofertasFiltradas = this.ofertas.filter(oferta =>
      this.matchesSearchTerm(oferta)
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  matchesSearchTerm(oferta: any): boolean {
    const searchTermLower = this.searchTerm.toLowerCase();

    // Comparar con descripción
    const matchesDescripcion = oferta.descripcion.toLowerCase().includes(searchTermLower);

    // Comparar con precio
    const matchesPrecio = oferta.precio.toString().includes(this.searchTerm);

    // Comparar con producto
    const productoNombre = this.getProductoNombre(oferta.product_id).toLowerCase();
    const matchesProducto = productoNombre.includes(searchTermLower);

    // Comparar con unidades de medida
    const unidadNombre = this.getUnidadNombre(oferta.medida_unidades_id).toLowerCase();
    const matchesUnidad = unidadNombre.includes(searchTermLower);

    // Comparar con estado
    const estadoNombre = this.getEstado(oferta.estado).toLowerCase();
    const matchesEstado = estadoNombre.includes(searchTermLower);

    return matchesDescripcion || matchesPrecio || matchesProducto || matchesUnidad || matchesEstado;
  }

  toggleFilters(): void {
    this.filtersVisible = !this.filtersVisible;
  }


  updatePagination(): void {
    this.totalPages = Math.ceil(this.ofertasFiltradas.length / this.itemsPerPage);
    this.paginatedOfertas = this.ofertasFiltradas.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  openImageModal(imagen: string): void {
    this.imagenOfertaUrl = imagen;
    this.imageModalVisible = true;
  }

  closeImageModal(): void {
    this.imageModalVisible = false;
  }

  openActivateModal(oferta: any): void {
    Swal.fire({
      title: '¿Activar Oferta?',
      text: `¿Estás seguro de que quieres activar la oferta ${oferta.id}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, activar',
    }).then(result => {
      if (result.isConfirmed) {
        this.activarOferta(oferta);
      }
    });
  }

  openDeactivateModal(oferta: any): void {
    Swal.fire({
      title: '¿Desactivar Oferta?',
      text: `¿Estás seguro de que quieres desactivar la oferta ${oferta.id}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, desactivar',
    }).then(result => {
      if (result.isConfirmed) {
        this.desactivarOferta(oferta);
      }
    });
  }

  activarOferta(oferta: any): void {
    this.ofertasService.activateOferta(oferta.id).subscribe(
      () => {
        oferta.estado = 1;
        Swal.fire('Éxito', 'Oferta activada exitosamente', 'success');
      },
      error => {
        Swal.fire('Error', 'Error al activar la oferta', 'error');
      }
    );
  }

  desactivarOferta(oferta: any): void {
    this.ofertasService.deactivateOferta(oferta.id).subscribe(
      () => {
        oferta.estado = 0;
        Swal.fire('Éxito', 'Oferta desactivada exitosamente', 'success');
      },
      error => {
        Swal.fire('Error', 'Error al desactivar la oferta', 'error');
      }
    );
  }


}
