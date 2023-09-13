import {
    ApplicationRef,
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ElementRef,
  Inject,
  Injector,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { asyncScheduler } from 'rxjs';
import { Report1Component } from './report1.component';

import {
  ComponentPortal,
  ComponentType,
  DomPortal,
  DomPortalOutlet,
  Portal,
  PortalOutlet,
  TemplatePortal
} from "@angular/cdk/portal";
import { DOCUMENT } from '@angular/common';


@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {


  reportRegister = new Map<string, any>();


  @ViewChild('domPortalContent') domPortalContent: ElementRef<HTMLElement>;
  @ViewChild('reportContainer', { read: ViewContainerRef }) reportContainer;
  @ViewChild("iframe") iframe; 

  //@ViewChild('pdfHtml') domPortalContent: ElementRef<HTMLElement>;

  private portalHost: PortalOutlet;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver, // deprectated API !
    private el: ElementRef,

    private injector: Injector,
    private appRef: ApplicationRef,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
      this.reportRegister.set("report1", Report1Component)
  }


  ngAfterViewInit() {
    //const htmlContent = this.el.nativeElement.innerHTML;
    //console.log(htmlContent);
  }

  rapportIsReady(componentRef){
    console.log('rapportIsReady loading');

    //const htmlString = componentRef.location.nativeElement.innerHTML;
    //console.log('HTML STRING:', htmlString);

    const iframe = this.iframe.nativeElement;

    this.portalHost = new DomPortalOutlet(
      iframe.contentDocument.body,
      this.componentFactoryResolver,
      this.appRef,
      this.injector,
      this.document // Pass the document object to the DomPortalOutlet
    );

    const sd = new DomPortal(this.domPortalContent);
     // Attach portal to host
     this.portalHost.attach(sd);

     iframe.contentWindow.print();


     asyncScheduler.schedule(() => {
        iframe.contentWindow.onafterprint = () => {
          //iframe.contentDocument.body.innerHTML = "";
        };
        iframe.contentWindow.print();

     });
    
  }

  generateReport() {
    this.reportContainer.clear();

    // deprectated API !
    // const factory =  this.componentFactoryResolver.resolveComponentFactory(PdfHtmlComponent);
    // const componentRef = this.container.createComponent(factory);

    //const componentRef = this.viewContainerRef.createComponent(PdfHtmlComponent);
    let reportName = "report1";
    let reportComponentName = this.reportRegister.get(reportName);
    const componentRef = this.reportContainer.createComponent(reportComponentName);

    //componentRef.instance.title = 'Injected Title';

    componentRef.instance.props.set( "title", "hello title");
    componentRef.instance.props.set( "chartProps", {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: [9999999999999999, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
        },
      ],
    });

    // subscribe to the report is_ready event
    componentRef.instance.reportIsReady.subscribe(val => this.rapportIsReady(componentRef));

    asyncScheduler.schedule(() => {
      /*
      const htmlString = componentRef.location.nativeElement.innerHTML;
      //componentRef.destroy();
      //console.log('HTML STRING:', htmlString);

      const portal = new TemplatePortal(
        this.templatePortal,
        this.viewContainerRef,
        {
         // heros: this.heros
        }
      );

      const portal2 = new DomPortal(this.reportContainer);

      // popo with print
      // https://stackoverflow.com/questions/62142577/issue-with-angular-8-cdk-portal-new-window  

      // https://stackblitz.com/edit/angular-cdk-portal-simple-example?embed=1

  
      const iframe = this.iframe.nativeElement;

      this.portalHost = new DomPortalOutlet(
        iframe.contentDocument.body,
        this.componentFactoryResolver,
        this.appRef,
        this.injector
      );

       // Attach portal to host
       this.portalHost.attach(portal);

       asyncScheduler.schedule(() => {
          iframe.contentWindow.print()
       });

       */
      
      /*
      const popupWin = window.open('', '_blank', 'width=600,height=600');
      console.log(popupWin);

      popupWin.document.open();
      popupWin.document.write(`
        <html>
        <head>
          <title>Print</title>
          <!-- Add any print-specific styles here -->
          <link rel="stylesheet" type="text/css" href="print-styles.css">
        </head>
        <body onload="window.print(); window.close()">
          ${htmlString}
        </body>
        </html>
      `);
      popupWin.document.close();
      */
  
    });
  }
}
