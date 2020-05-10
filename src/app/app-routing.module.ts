import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FirebaseUIComponent } from './angularx/firebaseui/firebaseui.component';
import { AdminComponent as AngularXAdminComponent } from './angularx/admin/admin.component';
import { DashboardComponent as AngularXDashboardComponent } from './angularx/admin/dashboard/dashboard.component';
import { AuthGuardService } from './auth-guard.service';
import { UsersComponent as AngularXUsersComponent } from './angularx/admin/users/users.component';
import { UserComponent as AngularXUserComponent } from './angularx/admin/user/user.component';
import { EditUserComponent as AngularXEditUserComponent } from './angularx/admin/edit-user/edit-user.component';
import { EditUserDetailComponent as AngularXEditUserDetailComponent } from './angularx/admin/edit-user/edit-user-detail/edit-user-detail.component';
import { AddUserComponent as AngularXAddUserComponent } from './angularx/admin/add-user/add-user.component';


const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: FirebaseUIComponent },
    {
        path: 'angularx-admin', component: AngularXAdminComponent, canActivate: [AuthGuardService], canActivateChild: [AuthGuardService],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: AngularXDashboardComponent },
            { path: 'users', component: AngularXUsersComponent },
            {
                path: 'user', component: AngularXUserComponent,
                children:[
                    { path: 'add', component: AngularXAddUserComponent },
                    { path: 'edit', component: AngularXEditUserComponent },
                    { path: 'edit/:uid', component: AngularXEditUserComponent },
                    { path: 'edit/:uid/:action', component: AngularXEditUserDetailComponent }
                ]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }