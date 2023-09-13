import { Component, ElementRef, EventEmitter, OnInit } from '@angular/core';

import { EChartsOption } from 'echarts';
import { NGX_ECHARTS_CONFIG } from 'ngx-echarts';

@Component({
  selector: 'report-1',
  templateUrl: './report1.component.html',
  styleUrls: ['./report1.component.css'],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useFactory: () => ({ echarts: () => import('echarts') }),
    },
  ],
})
export class Report1Component implements OnInit {


  props = new Map<string, any>();


  title: string = 'Default Title';

  STYLES: any = {
    MAIN_CONTAINER: 'background:red;',
    ITEM_BOX: 'color:red;',
  };

  chartOption: EChartsOption;


  register = new Map<string, boolean>();
  reportIsReady: EventEmitter<boolean> = new EventEmitter<boolean>();
  _reportIsReady = false;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
      this.title= this.props.get("title");
      this.chartOption =  this.props.get("chartProps");
  }


  ngAfterViewInit() {
    //const htmlContent = this.el.nativeElement.innerHTML;

  }

  onChartInit(echartsInstance) {
    this.register.set(echartsInstance.id, false);

    echartsInstance.on('finished', function (params){
      let isChartFinished: boolean | undefined = this.register.get(echartsInstance.id); 
      if(isChartFinished == undefined || isChartFinished == false) {
          console.log('finished loading');
          this.register.set(echartsInstance.id, true); 
          this.checkReportIsReady();
      }

    }.bind(this));

    echartsInstance.on('ready', function () {
      console.log('Chart is fully rendered and ready for interaction');
    });
  }

  checkReportIsReady() {
    if(!this._reportIsReady) {
        this.register.forEach((value: boolean, key: string) => {
          if(value == false) {
            console.log('Report not yet ready for printing: ' +  key);
            return false;
          }
      });

      this._reportIsReady = true;
      this.reportIsReady.emit(true);
    }
    return true;
  }

}
