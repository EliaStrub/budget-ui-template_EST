import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import locale from '@angular/common/locales/en-CH';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {registerLocaleData} from '@angular/common';
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {AuthInterceptor} from "./shared/interceptor/auth.interceptor";
import {LoginComponent} from "./shared/login/login.component";
import {AngularFireAuthModule} from "@angular/fire/compat/auth";
import {AngularFireModule} from "@angular/fire/compat";
import {environment} from "../environments/environment";

registerLocaleData(locale);

@NgModule({
  declarations: [AppComponent, LoginComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),],
  providers: [
    {provide: LOCALE_ID, useValue: 'en-CH'},
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
