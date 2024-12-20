import { Component, OnInit } from '@angular/core';
import { ProductosCategoriasService } from 'src/app/services/productos-categorias.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productoscategorias',
  templateUrl: './productoscategorias.component.html',
  styleUrls: ['./productoscategorias.component.css']
})
export class ProductoscategoriasComponent implements OnInit {

  productos: any[] = [];
  categorias: any[] = [];
  filteredProductos: any[] = [];
  paginatedProductos: any[] = [];
  searchTerm: string = '';
  filtersVisible: boolean = false;
  selectedCategoria: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  editModalVisible: boolean = false;
  activateModalVisible: boolean = false;
  deactivateModalVisible: boolean = false;
  createModalVisible: boolean = false;
  imageModalVisible: boolean = false;
  imagenProductoUrl: string = '';
  selectedProducto: any = {};
  newProducto: any = {};
  totalRegistros: number = 0;
  grupos: any[]=[];

  constructor(
    private productosCategoriasService: ProductosCategoriasService
  ) { }

  ngOnInit(): void {
    this.loadProductos();
    this.loadCategorias();
    this.loadGrupos();
  }

  loadProductos(): void {
    this.productosCategoriasService.getProductos().subscribe(
      data => {
        if (data) {
          this.productos = data;
          this.filteredProductos = [...this.productos];
          this.searchTerm = '';
          this.updatePagination();
        } else {
          console.error('Error en la respuesta del servicio:', data);
          Swal.fire('Error', 'La respuesta del servicio no es válida.', 'error');
        }
      },
      error => {
        console.error('Error al obtener los productos:', error);
        Swal.fire('Error', 'No se pudo obtener los productos.', 'error');
      }
    );
  }

  loadCategorias(): void {
    this.productosCategoriasService.getCategorias().subscribe(
      data => {
        if (data) {
          this.categorias = data;
          console.log('Categorías:', this.categorias);
        }
      },
      error => {
        console.error('Error al obtener las categorías:', error);
      }
    );
  }

  loadGrupos(): void {
    this.productosCategoriasService.getGrupos().subscribe(
      data => {
        console.log('Data:', data);
        if (data) {
          this.grupos = data;
          console.log('Grupos:', this.grupos);
        }
      },
      error => {
        console.error('Error al obtener los grupos:', error);
      }
    );
  }

  openImageModal(base64Image: string): void {
    if (base64Image) {
      this.imagenProductoUrl = `data:image/png;base64,${base64Image}`;
    } else {
      this.imagenProductoUrl = ''; // Asigna un valor vacío si no hay imagen
    }
    this.imageModalVisible = true;
  }


  closeImageModal(): void {
    this.imageModalVisible = false;
    this.imagenProductoUrl = '';
  }

  onFileSelected(event: any, mode: string): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result?.toString().split(',')[1];
        if (mode === 'create') {
          this.newProducto.imagenProducto = base64Image;
        } else if (mode === 'edit') {
          this.selectedProducto.imagenProducto = base64Image;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  buscar() {
    this.filteredProductos = this.productos.filter(producto =>
      this.matchesSearchTerm(producto) && this.matchesFilters(producto)
    );
    this.currentPage = 1;
    this.totalRegistros = this.filteredProductos.length;
    this.updatePagination();
  }

  matchesSearchTerm(producto: any): boolean {
    return producto.producto.toLowerCase().includes(this.searchTerm.toLowerCase());
  }

  matchesFilters(producto: any): boolean {
    return (
      (!this.selectedCategoria || producto.categoria == this.selectedCategoria)
    );
  }

  toggleFilters() {
    this.filtersVisible = !this.filtersVisible;
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredProductos.length / this.itemsPerPage);
    this.paginatedProductos = this.filteredProductos.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
    this.totalRegistros = this.filteredProductos.length;
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  openEditModal(producto: any): void {
    this.selectedProducto = { ...producto };
    this.editModalVisible = true;
  }

  closeEditModal(): void {
    this.editModalVisible = false;
  }

  submitEditForm(): void {
    this.productosCategoriasService.updateProducto(this.selectedProducto).subscribe(
      data => {
        console.log('Producto actualizado:', data);
        this.loadProductos();
        this.closeEditModal();
        Swal.fire('Producto Actualizado', 'El producto ha sido actualizado correctamente.', 'success');
      },
      error => {
        console.error('Error al actualizar el producto:', error);
        Swal.fire('Error', 'No se pudo actualizar el producto.', 'error');
      }
    );
  }

  openActivateModal(producto: any): void {
    this.selectedProducto = { ...producto };
    this.activateModalVisible = true;
  }

  closeActivateModal(): void {
    this.activateModalVisible = false;
  }

  activateProducto(): void {
    this.selectedProducto.estado = 1;
    this.productosCategoriasService.activateProducto(this.selectedProducto.id).subscribe(
      data => {
        console.log('Producto activado:', data);
        this.loadProductos();
        this.closeActivateModal();
        Swal.fire('Producto Activado', 'El producto ha sido activado correctamente.', 'success');
      },
      error => {
        console.error('Error al activar el producto:', error);
        Swal.fire('Error', 'No se pudo activar el producto.', 'error');
      }
    );
  }

  openDeactivateModal(producto: any): void {
    this.selectedProducto = { ...producto };
    this.deactivateModalVisible = true;
  }

  closeDeactivateModal(): void {
    this.deactivateModalVisible = false;
  }

  deactivateProducto(): void {
    this.selectedProducto.estado = 0;
    this.productosCategoriasService.deactivateProducto(this.selectedProducto.id).subscribe(
      data => {
        console.log('Producto desactivado:', data);
        this.loadProductos();
        this.closeDeactivateModal();
        Swal.fire('Producto Desactivado', 'El producto ha sido desactivado correctamente.', 'success');
      },
      error => {
        console.error('Error al desactivar el producto:', error);
        Swal.fire('Error', 'No se pudo desactivar el producto.', 'error');
      }
    );
  }

  openCreateModal(): void {
    this.newProducto = {};
    this.createModalVisible = true;
  }

  closeCreateModal(): void {
    this.createModalVisible = false;
  }

  submitCreateForm(): void {
    this.productosCategoriasService.addProducto(this.newProducto).subscribe(
      data => {
        console.log('Producto creado:', data);
        this.loadProductos();
        this.closeCreateModal();
        Swal.fire('Producto Creado', 'El producto ha sido creado correctamente.', 'success');
      },
      error => {
        console.error('Error al crear el producto:', error);
        Swal.fire('Error', 'No se pudo crear el producto.', 'error');
      }
    );
  }

  getCategoria(categoriaId: any): string {
    const categoria = this.categorias.find(cat => cat.id === categoriaId);
    return categoria ? categoria.categoria : 'Desconocida';
  }

  getEstado(estado: number): string {
    return estado === 1 ? 'Activo' : 'Inactivo';
  }

}
