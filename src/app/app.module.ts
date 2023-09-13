import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { Report1Component } from './report1.component';

import { NgxEchartsModule } from 'ngx-echarts';
import { PortalModule } from '@angular/cdk/portal';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    PortalModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'), // or import('./path-to-my-custom-echarts')
    }),
  ],
  declarations: [AppComponent, Report1Component],
  bootstrap: [AppComponent],
})
export class AppModule {}
