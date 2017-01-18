import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

//imports services

import {PubNubService} from '../services/pubnub';

import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { MyPagePage } from '../pages/my-page/my-page';
import { PrivatePagePage } from '../pages/private-page/private-page';

//imports services

@NgModule({
  declarations: [
    MyApp,
    Page1,
    Page2,
    MyPagePage,
    PrivatePagePage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Page1,
    Page2,
    PrivatePagePage,
    MyPagePage
  ],
  providers: [
  {provide: ErrorHandler, useClass: IonicErrorHandler},
  PubNubService
  ]
})
export class AppModule {}
