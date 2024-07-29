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

  isFullWidthChart(chartTitle: string): boolean {
    const fullWidthCategories = ["Otros productos", "Frutas", "Verduras/vegetales"];
    return fullWidthCategories.some(category => chartTitle.includes(category));
  }


  createSexoChartOptions(data: any) {
    const totalAsociados = data.cantidad_masculinos + data.cantidad_femeninos + data.cantidad_otro_sexo;

    return {
      title: {
        text: 'Cantidad de Asociados por Género',
        subtext: `Total asociados: ${totalAsociados}`,
        left: 'center',
        textStyle: {
          fontSize: 16,
          overflow: 'truncate',
        },
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'horizontal',
        left: 'center',
        bottom: 0,
        textStyle: {
          fontSize: 10
        },
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
      ],
      responsive: true,
      maintainAspectRatio: false
    };
  }

  createEdadChartOptions(data: any) {
    return {
      title: {
        text: 'Cantidad de Asociados por Edad',
        textStyle: {
          fontSize: 16,
          overflow: 'truncate',
        },
      },
      tooltip: {},
      legend: {
        data: ['Edad'],
        textStyle: {
          fontSize: 10
        },
      },
      xAxis: {
        data: Object.values(data).filter((value: any, index: number) => index % 2 === 0),
        axisLabel: {
          fontSize: 10
        }
      },
      yAxis: {
        axisLabel: {
          fontSize: 10
        }
      },
      series: [{
        name: 'Cantidad',
        type: 'bar',
        data: Object.values(data).filter((value: any, index: number) => index % 2 !== 0),
        barWidth: '50%'
      }],
      responsive: true,
      maintainAspectRatio: false
    };
  }

  createVeredaChartOptions(data: any) {
    return {
      title: {
        text: 'Cantidad de Asociados por Vereda',
        subtext: 'Asociados por veredas',
        left: 'center',
        textStyle: {
          fontSize: 16,
          overflow: 'truncate',
        },
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'horizontal',
        left: 'center',
        bottom: 0,
        textStyle: {
          fontSize: 10
        },
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
      ],
      responsive: true,
      maintainAspectRatio: false
    };
  }

  createHectareasChartOptions(data: any) {
    return {
      title: {
        text: 'Fincas por Hectáreas',
        textStyle: {
          fontSize: 16,
          overflow: 'truncate',
        },
      },
      tooltip: {},
      legend: {
        data: ['Hectáreas'],
        textStyle: {
          fontSize: 10
        },
      },
      xAxis: {
        type: 'category',
        data: Object.keys(data),
        axisLabel: {
          fontSize: 10
        }
      },
      yAxis: {
        axisLabel: {
          fontSize: 10
        }
      },
      series: [{
        name: 'Cantidad',
        type: 'bar',
        data: Object.values(data).map((value: any) => parseInt(value, 10)),
        barWidth: '50%'
      }],
      responsive: true,
      maintainAspectRatio: false
    };
  }

  createTipoPredioChartOptions(data: any) {
    return {
      title: {
        text: 'Fincas por Tipo de Predio',
        left: 'center',
        textStyle: {
          fontSize: 16,
          overflow: 'truncate',
        },
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'horizontal',
        left: 'center',
        bottom: 0,
        textStyle: {
          fontSize: 10
        },
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
      ],
      responsive: true,
      maintainAspectRatio: false
    };
  }

  createProductosChartOptions(data: any) {
    return data.map((categoria: any) => ({
      title: {
        text: `Productos de Categoría: ${categoria.categoria}`,
        left: 'center',
        textStyle: {
          fontSize: 16,
          overflow: 'truncate',
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: any) => {
          const param = params[0];
          const producto = categoria.detalles_productos[param.dataIndex];
          return `${param.name}<br/>Cantidad por Fincas: ${producto.cantidad_por_fincas}<br/>Porcentaje: ${producto.porcentaje}%`;
        }
      },
      legend: {
        orient: 'horizontal',
        left: 'center',
        bottom: 0,
        textStyle: {
          fontSize: 10
        },
      },
      xAxis: {
        type: 'category',
        data: categoria.detalles_productos.map((producto: any) =>
          producto.producto.includes('MASAS DE MAÍZ') ? 'Masa de maíz' : producto.producto
        ),
        axisLabel: {
          rotate: 0,
          interval: 0,
          textStyle: {
            fontSize: 10,
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          textStyle: {
            fontSize: 10,
          }
        }
      },
      series: [
        {
          name: 'Cantidad por Fincas',
          type: 'bar',
          data: categoria.detalles_productos.map((producto: any) => producto.cantidad_por_fincas),
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          label: {
            show: true,
            position: 'top',
            textStyle: {
              fontSize: 10
            },
            formatter: (params: any) => {
              const producto = categoria.detalles_productos[params.dataIndex];
              return `${producto.porcentaje}%`;
            }
          }
        }
      ],
      responsive: true,
      maintainAspectRatio: false
    }));
  }


  createProductosCategoriasChartOptions(data: any) {
    return {
      title: {
        text: 'Productos por Categorías',
        textStyle: {
          fontSize: 16,
          overflow: 'truncate',
        },
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
        data: ['Cantidad por Fincas', 'Porcentaje'],
        textStyle: {
          fontSize: 10
        },
      },
      xAxis: [
        {
          type: 'category',
          data: data.map((item: any) => item.categoria),
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            interval: 0,
            rotate: 0,
            formatter: function (value: string) {
              return value.length > 10 ? value.slice(0, 10) + '...' : value;
            },
            fontSize: 10
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: 'Cantidad por Fincas',
          position: 'left',
          axisLabel: {
            fontSize: 10
          }
        },
        {
          type: 'value',
          name: 'Porcentaje',
          position: 'right',
          axisLabel: {
            formatter: '{value}%',
            fontSize: 10
          }
        }
      ],
      series: [
        {
          name: 'Cantidad por Fincas',
          type: 'bar',
          data: data.map((item: any) => item.cantidad_por_fincas),
          barWidth: '50%'
        },
        {
          name: 'Porcentaje',
          type: 'line',
          yAxisIndex: 1,
          data: data.map((item: any) => item.porcentaje)
        }
      ],
      responsive: true,
      maintainAspectRatio: false
    };
  }
}
