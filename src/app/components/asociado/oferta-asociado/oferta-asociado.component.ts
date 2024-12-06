import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OfertasAsociadoService } from 'src/app/services/ofertas-asociado.service';
import { PersonasService } from 'src/app/services/personas.service';
import { ProductosCategoriasService } from 'src/app/services/productos-categorias.service';
import { UnidadesMedidaService } from 'src/app/services/unidades-medida.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-oferta-asociado',
  templateUrl: './oferta-asociado.component.html',
  styleUrls: ['./oferta-asociado.component.css']
})
export class OfertaAsociadoComponent {

  ofertas: any[] = [];
  permisos: any;
  persona: any;
  productos: any[] = [];
  unidades: any[] = [];
  filteredOfertas: any[] = [];
  paginatedOfertas: any[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  createModalVisible: boolean = false;
  editModalVisible: boolean = false;
  activateModalVisible: boolean = false;
  deactivateModalVisible: boolean = false;
  selectedOferta: any = {};
  newOferta: any = {};
  idUsuario: string = '';
  imagenBase64: string | ArrayBuffer | null = null;
  contactoPublico: any[] = [];
  tieneContactoPublico: boolean = true;
  idAsociacion: any;
  imagenGeneral: any;
  showImagenGeneral: boolean=false;


  constructor(
    private ofertasAsociadoService: OfertasAsociadoService,
    private productosService: ProductosCategoriasService,
    private unidadesService: UnidadesMedidaService,
    private personasService: PersonasService,
    private router: Router) { }

  ngOnInit(): void {

    this.loadOfertas();
    this.loadProductos();
    this.loadUnidades();
    this.loadPermisos();
    this.loadFormasDeContacto();

  }
  loadFormasDeContacto(): void {
    const idAsociado = localStorage.getItem('identificador_asociado') || '';

    this.loadAsociacion(idAsociado);

    this.personasService.getInfoOneAsociado(idAsociado).subscribe(
      (data) => {
        if (data && data.asociado && data.asociado.length > 0) {
          this.persona = data.asociado[0];
          this.contactoPublico = [
            { label: 'Teléfono', valor: this.persona.telefono, esPublico: this.permisos.telefono === 1 },
            { label: 'Correo', valor: this.persona.correo, esPublico: this.permisos.correo === 1 },
            { label: 'WhatsApp', valor: this.persona.whatsapp, esPublico: this.permisos.whatsapp === 1 },
            { label: 'Facebook', valor: this.persona.facebook, esPublico: this.permisos.facebook === 1 },
            { label: 'Instagram', valor: this.persona.instagram, esPublico: this.permisos.instagram === 1 }
          ].filter(contacto => contacto.esPublico);
        } else {
          console.error('No se encontró el asociado');
        }
      },
      (error) => {
        console.error('Error al obtener persona', error);
      }
    );
  }

  loadAsociacion(idAsociado:string): void {
    if (idAsociado) {
      this.ofertasAsociadoService.getAsociacion(idAsociado).subscribe(
        (data) => {
          if (data && data.asociacion_finca && data.asociacion_finca.length > 0) {
            this.idAsociacion = data.asociacion_finca[0].id;
          } else {
            console.error('No se encontraron asociaciones en la respuesta');
          }
        },
        (error) => {
          console.error('Error al obtener asociaciones', error);
        }
      );
    } else {
      console.error('No se encontró idAsociado en el localStorage');
    }

  }

  loadOfertas(): void {
    const asociadosFincaId = localStorage.getItem('identificador_asociado') || '';
    this.ofertasAsociadoService.getOfertas(asociadosFincaId).subscribe(
      data => {
        if (data && data.estado === 'Ok' && Array.isArray(data.ofertasActivas)) {
          this.ofertas = data.ofertasActivas;
          this.filteredOfertas = [...this.ofertas];
          this.updatePagination();
        } else {
          Swal.fire('Error', 'La respuesta del servicio no es válida.', 'error');
        }
      },
      error => {
        Swal.fire('Error', 'No se pudo obtener las ofertas.', 'error');
      }
    );
  }

  loadImagenGeneral(idProducto:string){
    this.productosService.getOneProducto(idProducto).subscribe(
      data => {
        if(data){
          this.imagenGeneral=data;
          this.showImagenGeneral=true;
        }else{
          this.imagenGeneral="";
          this.showImagenGeneral=false;
        }
      }
    );
  }

  loadProductos(): void {
    const asociadosFincaId = localStorage.getItem('identificador_asociado') || '';
    this.personasService.getProductosByAsociado(asociadosFincaId).subscribe(
      data => {
        if (data) {
          this.productos = data;
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

  loadPermisos(): void {
    const idAsociado = localStorage.getItem('identificador_asociado') || '';
    if (idAsociado) {
      this.personasService.getInfoOneAsociado(idAsociado).subscribe(
        (data) => {
          if (data && data.permisos && data.permisos.length > 0) {
            this.permisos = data.permisos[0];
          } else {
            console.error('No se encontraron permisos en la respuesta');
          }
        },
        (error) => {
          console.error('Error al obtener permisos', error);
        }
      );
    } else {
      console.error('No se encontró idAsociado en el localStorage');
    }

  }

  loadUnidades(): void {
    this.unidadesService.getUnidades().subscribe(
      data => {
        if (data) {
          this.unidades = data;
          console.log('Categorías:', this.unidades);
        }
      },
      error => {
        console.error('Error al obtener las categorías:', error);
      }
    );
  }

  getProductoNombre(productId: number): string {
    const producto = this.productos.find(prod => prod.idProducto === productId);
    return producto ? producto.producto : '';
  }

  getUnidadNombre(unidadId: number): string {
    const unidad = this.unidades.find(unid => unid.id === unidadId);
    return unidad ? unidad.unidad : '';
  }

  buscar(): void {
    this.filteredOfertas = this.ofertas.filter(oferta => this.matchesSearchTerm(oferta));
    this.currentPage = 1;
    this.updatePagination();
  }

  matchesSearchTerm(oferta: any): boolean {
    return oferta.product_id.toString().includes(this.searchTerm);
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredOfertas.length / this.itemsPerPage);
    this.paginatedOfertas = this.filteredOfertas.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
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
  openCreateModal(): void {
    const persona = this.persona || {};  // Verifica si el objeto persona existe.
    this.newOferta = {
      product_id: '',
      unidadId: '',
      start_date: '',
      cantidad: '',
      medida_unidades_id: '',
      precio: '',
      descripcion: '',
      telefono: persona.telefono || '',
      telefono_visible: false,
      whatsapp: persona.whatsapp || '',
      whatsapp_visible: false,
      correo: persona.correo || '',
      correo_visible: false,
      facebook: persona.facebook || '',
      facebook_visible: false,
      instagram: persona.instagram || '',
      instagram_visible: false,
      imagenProducto: ''
    };
    this.createModalVisible = true;
  }


  closeCreateModal(): void {
    this.createModalVisible = false;
  }

  submitCreateForm(): void {

    // Verificar si al menos una forma de contacto es pública
    this.tieneContactoPublico =
      (this.newOferta.telefono && this.newOferta.telefono_visible) ||
      (this.newOferta.whatsapp && this.newOferta.whatsapp_visible) ||
      (this.newOferta.correo && this.newOferta.correo_visible) ||
      (this.newOferta.facebook && this.newOferta.facebook_visible) ||
      (this.newOferta.instagram && this.newOferta.instagram_visible);

    if (this.tieneContactoPublico) {
      console.log("NewOferta Value: ", this.newOferta);
      console.log("idAsociadoFinca Value: ", this.idAsociacion);
      this.ofertasAsociadoService.addOferta(this.newOferta, this.idAsociacion).subscribe(
        response => {
          Swal.fire('Éxito', 'Oferta creada correctamente.', 'success');
          this.loadOfertas();
          this.closeCreateModal();
        },
        error => {
          Swal.fire('Error', 'Error al crear la oferta.', 'error');
          this.closeCreateModal();
        }
      );
    } else {
      Swal.fire('Error', 'Debe tener al menos una forma de contacto pública.', 'error');
    }
  }


  openEditModal(oferta: any): void {
    this.selectedOferta = { ...oferta };
    this.editModalVisible = true;
  }

  closeEditModal(): void {
    this.editModalVisible = false;
  }

  submitEditForm(): void {
    const idAsociadoFinca = localStorage.getItem('identificador_asociado_finca') || '';

    // Asegurarse de que todos los campos de visibilidad estén definidos
    this.selectedOferta.telefono_visible = !!this.selectedOferta.telefono_visible;
    this.selectedOferta.whatsapp_visible = !!this.selectedOferta.whatsapp_visible;
    this.selectedOferta.correo_visible = !!this.selectedOferta.correo_visible;
    this.selectedOferta.facebook_visible = !!this.selectedOferta.facebook_visible;
    this.selectedOferta.instagram_visible = !!this.selectedOferta.instagram_visible;

    // Verificar si al menos una forma de contacto es pública
    this.tieneContactoPublico =
        (this.selectedOferta.telefono && this.selectedOferta.telefono_visible) ||
        (this.selectedOferta.whatsapp && this.selectedOferta.whatsapp_visible) ||
        (this.selectedOferta.correo && this.selectedOferta.correo_visible) ||
        (this.selectedOferta.facebook && this.selectedOferta.facebook_visible) ||
        (this.selectedOferta.instagram && this.selectedOferta.instagram_visible);

    if (this.tieneContactoPublico) {
        this.ofertasAsociadoService.updateOferta(this.selectedOferta, idAsociadoFinca).subscribe(
            response => {
                Swal.fire('Éxito', 'Oferta actualizada correctamente.', 'success');
                this.loadOfertas();
                this.closeEditModal();
            },
            error => {
                Swal.fire('Error', 'No se pudo actualizar la oferta.', 'error');
            }
        );
    } else {
        Swal.fire('Error', 'Debe tener al menos una forma de contacto pública.', 'error');
    }
}


  openDeactivateModal(oferta: any): void {
    this.selectedOferta = { ...oferta };
    this.deactivateModalVisible = true;
  }

  closeDeactivateModal(): void {
    this.deactivateModalVisible = false;
  }

  deactivateOferta(): void {

    const ofertaId = this.selectedOferta.id;
    this.ofertasAsociadoService.deactivateOferta(ofertaId).subscribe(
      data => {
        this.loadOfertas();
        this.closeDeactivateModal();
        Swal.fire('Oferta Desactivada', 'La oferta ha sido desactivada correctamente.', 'success');
      },
      error => {
        Swal.fire('Error', 'No se pudo desactivar la oferta.', 'error');
      }
    );
  }

  onFileSelected(event: any, mode: string): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result?.toString().split(',')[1];
        if (mode === 'create') {
          this.newOferta.imagenProducto = base64Image;
        } else if (mode === 'edit') {
          this.selectedOferta.imagenProducto = base64Image;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      // Cuando el archivo se haya leído como base64, lo guardamos
      reader.onload = () => {
        this.imagenBase64 = reader.result;
        console.log('Imagen en Base64: ', this.imagenBase64); // Muestra el valor Base64
      };

      // Leer el archivo como una URL en base64
      reader.readAsDataURL(file);
    }
  }


}
