import { Component, OnInit } from '@angular/core';
import { OfertasAsociadoService } from 'src/app/services/ofertas-asociado.service';
import { ProductosCategoriasService } from 'src/app/services/productos-categorias.service';
import { UnidadesMedidaService } from 'src/app/services/unidades-medida.service';
import { CategoriasproductosComponent } from '../administrador/categoriasproductos/categoriasproductos.component';

export interface Oferta {
  id: number;
  imagenProducto: string;
  start_date: string;
  end_date: string;
  estado: number;
  telefono_visible: number;
  telefono: string;
  whatsapp_visible: number;
  whatsapp: string;
  correo_visible: number;
  correo: string;
  cantidad: number;
  precio: string;
  descripcion: string;
  product_id: number;
  asociados_finca_id: number;
  medida_unidades_id: number;
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  todasOfertas: Oferta[] = [];
  ofertas: Oferta[] = []; 
  productos: any [] =[];
  unidades: any [] =[];
  categorias: any [] =[];
  ofertaSeleccionada: Oferta | null = null; 
  mostrarModal: boolean = false; 

  searchTerm: string = ''; 
  selectedProduct: string = '';  
  selectedCategory: string = '';

  constructor(private ofertasAsociados: OfertasAsociadoService,
    private productosService: ProductosCategoriasService,
    private unidadesService: UnidadesMedidaService,
  ) {}

  ngOnInit(): void {
    this.obtenerOfertas();
    this.loadProductos();
    this.loadUnidades();
    this.loadCategorias();

  }

  obtenerOfertas(): void {
    this.ofertasAsociados.getOfertaPublicas().subscribe(
      (response) => {
        this.todasOfertas = response.ofertas;
        this.ofertas = [...this.todasOfertas];
      },
      (error) => {
        console.error('Error al obtener ofertas:', error);
      }
    );
  }

  loadProductos(): void {
    this.productosService.getProductos().subscribe(
      data => {
        if (data) {
          this.productos = data;
          
        }
      },
      error => {
        console.error('Error al obtener los productos', error);
      }
    );
  }

  loadUnidades(): void {
    this.unidadesService.getUnidades().subscribe(
      data => {
        if (data) {
          this.unidades = data;
        }
      },
      error => {
        console.error('Error al obtener las unidades:', error);
      }
    );
  }
  loadCategorias(): void {
    this.productosService.getCategorias().subscribe(
      data => {
        if (data) {
          this.categorias = data;
        }
      },
      error => {
        console.error('Error al obtener las categorías:', error);
      }
    );
  }

  buscarOfertas(): void {
    this.filtrarOfertas();
  }

  filtrarOfertas(): void {
    this.ofertas = this.todasOfertas.filter((oferta) => {
      const productoNombre = this.getProductoNombre(oferta.product_id);
      const categoriaId = this.getCategoriaId(oferta.product_id);

      // Filtrar por búsqueda, producto y categoría
      const matchesSearch = this.searchTerm === '' || oferta.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase()) || productoNombre.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesProduct = this.selectedProduct === '' || oferta.product_id.toString() === this.selectedProduct;
      const matchesCategory = this.selectedCategory === '' || categoriaId === this.selectedCategory;

      return matchesSearch && matchesProduct && matchesCategory;
    });
  }

  getProductoNombre(id: number): string {
    const producto = this.productos.find(prod => prod.id === id);
    console.log('Producto encontrado para ID:', id, producto); // Comprobar si se encuentra el producto correcto
    return producto ? producto.producto : 'Producto no encontrado';
  }
  
  getCategoriaId(productId: number): string {
    const producto = this.productos.find(prod => prod.id === productId);
    return producto ? producto.categoria.toString() : '';
  }

  getUnidadNombre(unidadId: number): string {
    const unidad = this.unidades.find(unid => unid.id === unidadId);
    return unidad ? unidad.unidad : '';
  }

  getCategoriaNombre(categoriaid: number): string {
    const categoria = this.categorias.find(cat => cat.id === categoriaid);
    return categoria ? categoria.categoria : '';
  }

  seleccionarOferta(oferta: Oferta): void {
    // Restaurar las ofertas visibles incluyendo la oferta seleccionada previamente
    //this.ofertas = [...this.todasOfertas]; 

    // Eliminar la oferta seleccionada actual de la lista de ofertas visibles
    //this.ofertas = this.ofertas.filter(o => o.id !== oferta.id);

    // Asignar la nueva oferta seleccionada
    this.ofertaSeleccionada = oferta;
    const container = document.getElementById('ofertasContainer');
    if (container) {
      const offset = -100;
      const topPosition = container.getBoundingClientRect().top + window.scrollY + offset;
    
      window.scrollTo({
        top: topPosition,
        behavior: 'smooth'
      });
    }
    
  }
  abrirModalContacto(): void {
    this.mostrarModal = true;
  }

  cerrarModalContacto(): void {
    this.mostrarModal = false;
  }

}