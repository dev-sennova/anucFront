import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as echarts from 'echarts';
import { EmpresaGlobalesService } from 'src/app/services/empresa-globales.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements AfterViewInit {
  sexoChartOptions: any;
  edadChartOptions: any;
  veredaChartOptions: any;
  hectareasChartOptions: any;
  tipoPredioChartOptions: any;
  productosChartOptions: any[] = [];
  productosCategoriasChartOptions: any;

  constructor(private empresaService: EmpresaGlobalesService) { }

  ngAfterViewInit() {
    this.empresaService.getEmpresaEstadisticas().subscribe(
      data => {
        this.sexoChartOptions = this.createSexoChartOptions(data.datos_sexo);
        this.edadChartOptions = this.createEdadChartOptions(data.datos_edad);
        this.veredaChartOptions = this.createVeredaChartOptions(data.datos_vereda);
        this.hectareasChartOptions = this.createHectareasChartOptions(data.fincas_por_hectareas);
        this.tipoPredioChartOptions = this.createTipoPredioChartOptions(data.fincas_por_tipo_predio);
        this.productosChartOptions = this.createProductosChartOptions(data.productos_por_categorias);
        this.productosCategoriasChartOptions = this.createProductosCategoriasChartOptions(data.productos_por_categorias);
      },
      error => {
        console.error('Error Code: ' + error.status + '\nMessage: ' + error.message);
      }
    );
  }

  createSexoChartOptions(data: any) {
    const totalAsociados = data.cantidad_masculinos + data.cantidad_femeninos + data.cantidad_otro_sexo;

    return {
      title: {
        text: 'Cantidad de Asociados por Genero',
        subtext: `Total asociados: ${totalAsociados}`,
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: 'Género',
          type: 'pie',
          radius: '50%',
          data: [
            { value: data.cantidad_masculinos, name: 'Masculino' },
            { value: data.cantidad_femeninos, name: 'Femenino' },
            { value: data.cantidad_otro_sexo, name: 'Otro' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  }

  createEdadChartOptions(data: any) {
    return {
      title: {
        text: 'Cantidad de Asociados por Edad'
      },
      tooltip: {},
      legend: {
        data: ['Edad']
      },
      xAxis: {
        data: Object.values(data).filter((value: any, index: number) => index % 2 === 0)
      },
      yAxis: {},
      series: [{
        name: 'Cantidad',
        type: 'bar',
        data: Object.values(data).filter((value: any, index: number) => index % 2 !== 0)
      }]
    };
  }

  createVeredaChartOptions(data: any) {
    return {
      title: {
        text: 'Cantidad de Asociados por Vereda',
        subtext: 'Asociados por veredas',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: 'Vereda',
          type: 'pie',
          radius: '50%',
          data: data.map((item: any) => ({ value: item.cantidad_por_vereda, name: item.vereda })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  }

  createHectareasChartOptions(data: any) {
    return {
      title: {
        text: 'Fincas por Hectáreas'
      },
      tooltip: {},
      legend: {
        data: ['Hectáreas']
      },
      xAxis: {
        type: 'category',
        data: Object.keys(data)
      },
      yAxis: {},
      series: [{
        name: 'Cantidad',
        type: 'bar',
        data: Object.values(data).map((value: any) => parseInt(value, 10))
      }]
    };
  }

  createTipoPredioChartOptions(data: any) {
    return {
      title: {
        text: 'Fincas por Tipo de Predio',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: 'Tipo de Predio',
          type: 'pie',
          radius: '50%',
          data: data.map((item: any) => ({ value: item.cantidad_por_vereda, name: item.tipo_predio })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  }

  createProductosChartOptions(data: any) {
    return data.map((categoria: any) => ({
      title: {
        text: `Productos de Categoría: ${categoria.categoria}`,
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: 'Producto',
          type: 'pie',
          radius: '50%',
          data: categoria.detalles_productos.map((producto: any) => ({
            value: producto.cantidad_por_fincas,
            name: producto.producto
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }));
  }

  createProductosCategoriasChartOptions(data: any) {
    return {
      title: {
        text: 'Productos por Categorías'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function (params: any) {
          let result = `<div style="padding: 5px; border: 1px solid #ccc; background-color: #fff; border-radius: 4px;">`;
          result += `<div style="font-weight: bold; color: #333;">${params[0].name}</div>`;
          params.forEach((item: any) => {
            if (item.seriesName === 'Porcentaje') {
              result += `<div style="color: #73DF53;"><strong>${item.seriesName}:</strong> ${item.value}%</div>`;
            } else {
              result += `<div style="color: #095D9B;"><strong>${item.seriesName}:</strong> ${item.value}</div>`;
            }
          });
          result += `</div>`;
          return result;
        }
      },
      legend: {
        data: ['Cantidad por Fincas', 'Porcentaje']
      },
      xAxis: [
        {
          type: 'category',
          data: data.map((item: any) => item.categoria),
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {  
            interval: 0, // Muestra todas las etiquetas
            rotate: 0, // Rotación de las etiquetas
            formatter: function (value: string) {
              return value.length > 10 ? value.slice(0, 10) + '...' : value;
            }
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: 'Cantidad por Fincas',
          position: 'left'
        },
        {
          type: 'value',
          name: 'Porcentaje',
          position: 'right',
          axisLabel: {
            formatter: '{value}%'
          }
        }
      ],
      series: [
        {
          name: 'Cantidad por Fincas',
          type: 'bar',
          data: data.map((item: any) => item.cantidad_por_fincas)
        },
        {
          name: 'Porcentaje',
          type: 'line',
          yAxisIndex: 1,
          data: data.map((item: any) => item.porcentaje)
        }
      ]
    };
  }
  

}
