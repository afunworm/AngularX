import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AngularXDialogService } from './angularx-dialog.service';
import { AngularXDialogComponent } from './angularx-dialog.component';

@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        MatButtonModule,
        MatDialogModule
    ],
    providers: [
        AngularXDialogService
    ],
    declarations: [
        AngularXDialogComponent
    ],
    exports: [
        AngularXDialogComponent
    ],
    entryComponents: [
        AngularXDialogComponent
    ]
})
export class AngularXDialogModule {}
