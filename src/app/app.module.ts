import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { environment } from '../environments/environment';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';

import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';

import { AppMaterialModule } from './app-material.module';
import { FirebaseUIComponent } from './angularx/firebaseui/firebaseui.component';
import { AdminComponent as AngularXAdminComponent } from './angularx/admin/admin.component';
import { DashboardComponent as AngularXDashboardComponent } from './angularx/admin/dashboard/dashboard.component';
import { FormsModule } from '@angular/forms';
import { UsersComponent as AngularXUsersComponent, UserDialog } from './angularx/admin/users/users.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AngularXTableComponent } from './angularx/shared/services/angularx-table/angularx-table.component';
import { EditUserComponent } from './angularx/admin/edit-user/edit-user.component';
import { UserComponent } from './angularx/admin/user/user.component';
import { AngularXInterceptorService } from './angularx/shared/services/angularx-interceptor/angularx-interceptor.service';
import { EditUserDetailComponent } from './angularx/admin/edit-user/edit-user-detail/edit-user-detail.component';
import { AddUserComponent } from './angularx/admin/add-user/add-user.component';
import { AngularXDialogModule } from './angularx/shared/services/angularx-dialog/angularx-dialog.module';
import { AngularXDialogComponent } from './angularx/shared/services/angularx-dialog/angularx-dialog.component';
import { AngularxLoadingComponent } from './angularx/shared/services/angularx-loading/angularx-loading.component';
import { NgxInputDirective } from './angularx/shared/directives/ngx-input.directive';
import { AngularxWrapperComponent } from './angularx/shared/components/angularx-wrapper/angularx-wrapper.component';

@NgModule({
    declarations: [
        AppComponent,
        FirebaseUIComponent,
        AngularXAdminComponent,
        AngularXDashboardComponent,
        AngularXUsersComponent,
        UserDialog,
        AngularXTableComponent,
        EditUserComponent,
        UserComponent,
        EditUserDetailComponent,
        AddUserComponent,
        AngularxLoadingComponent,
        NgxInputDirective,
        AngularxWrapperComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        AppMaterialModule,
        FormsModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        AngularFireStorageModule,
        HttpClientModule,
        NgxMaterialTimepickerModule,
        AngularXDialogModule
    ],
    entryComponents: [
        AngularXDialogComponent
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AngularXInterceptorService,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }